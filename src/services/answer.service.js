'use strict';

import angular from 'angular';
import _ from 'lodash';
import moment from 'moment';
import QuestionnaireAnswer from '../models/result';
import uuid from 'node-uuid';
import cbtp from '../util/cb-to-promise';
import cstp from '../util/cognito-sync-to-promise';
import getDataSet from '../util/get-data-set';
import UserService from './user.service';

const CHILD_TO_RESPONSES_DS_NAME = 'childToResponses';
const RESPONSES_DS_NAME = 'responses';

class AnswersService {
  constructor($q, userService) {
    this.$q = $q;
    this.userService = userService;
  }

  getResponsesForChild(childId) {
    return this._getResponseIdsForChildWithDataSet(childId)
      .then(({responseIds}) => this.$q.all(responseIds.map(id => this.getResponseById(id))))
  }

  _getResponseIdsForChildWithDataSet(childId) {
    return getDataSet(CHILD_TO_RESPONSES_DS_NAME, this.userService, this.$q)
      .then(dataSet =>  cbtp.call(dataSet, this.$q, dataSet.get, childId)
        .then(json => {
          dataSet, json
        })
      )
      .then(({dataSet, json = '{}'}) => {
        responseIds: JSON.parse(json), dataSet
      })
  }

  getResponseById(id) {
    return this._getResponseByIdWithDataSet(id).response;
  }

  _getResponseByIdWithDataSet(id) {
    return getDataSet(RESPONSES_DS_NAME, this.userService, this.$q)
      .then(dataSet => ({
        dataSet, json: cbtp.call(dataSet, this.$q, dataSet.get, id)
      }))
      .then(({json = '{}', dataSet}) => {
        response: JSON.parse(json), dataSet
      });
  }

  addResponse(childId, ageId) {
    const id = uuid.v1();

    const response = {
      id,
      ageId,
      created: moment().toISOString(),
      modified: moment().toISOString(),
      questionnaires: []
    };

    const responsesPromise = getDataSet(RESPONSES_DS_NAME, this.userService, this.$q)
      .then(dataSet => cbtp.call(dataSet, this.$q, dataSet.put, id, JSON.stringify(response)).then(() => dataSet))
      .then(dataSet => cstp(this.$q, dataSet, true));

    const childIdPromise = this._getResponseIdsForChildWithDataSet(childId)
      .then(({responseIds, dataSet}) => cbtp.call(dataSet, this.$q, dataSet.put, id, JSON.stringify(responseIds.concat(id)))
        .then(() => dataSet)
      )
      .then(dataSet => cstp(this.$q, dataSet, true));

    return this.$q.all(responsesPromise, childIdPromise);
  }

  addAnswersToResponse(responseId, questionnaireId, answers) {
    const id = uuid.v1();

    return this._getResponseByIdWithDataSet(responseId)
      .then(({response, dataSet}) => {
        response.questionnaires[questionnaireId] = answers;
        response.modified = moment().toISOString();

        return cbtp.call(dataSet, this.$q, dataSet.put, responseId, JSON.stringify(response)).then(() => dataSet);
      })
      .then(dataSet => cstp(this.$q, dataSet, true))
      .catch(e => {
        console.error(e.stack);
      });
  }
}

AnswersService.$inject = ['$q', 'UserService'];

export default angular.module('services.answers', ['ngStorage'])
  .service('AnswerService', AnswersService)
  .name;