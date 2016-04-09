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
const RESPONSES_DATASET_NAME = 'responses';

class AnswersService {
  constructor($q, userService) {
    this.$q = $q;
    this.userService = userService;

    this.responseAddCache = {};
    this.responseGetCache = {};
  }

  getResponsesForChild(childId) {
    return this._getResponseIdsForChildWithDataSet(childId)
      .then(({responseIds}) => this.$q.all(responseIds.map(id => this.getResponseById(id))))
  }

  _getResponseIdsForChildWithDataSet(childId) {
    return getDataSet(CHILD_TO_RESPONSES_DS_NAME, this.userService, this.$q)
      .then(dataSet =>  cbtp.call(dataSet, this.$q, dataSet.get, childId)
        .then(json => ({
          dataSet, json
        }))
      )
      .then(({dataSet, json = '[]'}) => ({
        responseIds: JSON.parse(json), dataSet
      }));
  }

  getResponseById(id) {
    return this._getResponseByIdWithDataSet(id).then(result => result.response);
  }

  _getResponseByIdWithDataSet(id) {
    if (!this.responseGetCache[id]) {
      this.responseGetCache[id] = getDataSet(RESPONSES_DATASET_NAME, this.userService, this.$q)
        .then(dataSet => cbtp.call(dataSet, this.$q, dataSet.get, id).then(json => ({json, dataSet})))
        .then(({json = '{}', dataSet}) => ({
          response: JSON.parse(json), dataSet
        }));
    }

    return this.responseGetCache[id]
  }

  addResponse(childId, ageId) {
    const key = `${childId}-${ageId}`;

    if (!this.responseAddCache[key]) {
      const id = uuid.v1();

      const response = {
        id,
        ageId,
        created: moment().toISOString(),
        modified: moment().toISOString(),
        childId,
        questionnaires: {}
      };

      const responsesPromise = getDataSet(RESPONSES_DATASET_NAME, this.userService, this.$q)
        .then(dataSet => cbtp.call(dataSet, this.$q, dataSet.put, id, JSON.stringify(response)).then(() => dataSet))
        .then(dataSet => cstp(this.$q, dataSet, true));

      const childIdPromise = this._getResponseIdsForChildWithDataSet(childId)
        .then(({responseIds, dataSet}) => cbtp.call(dataSet, this.$q, dataSet.put, childId, JSON.stringify(responseIds.concat(id)))
          .then(() => dataSet)
        )
        .then(dataSet => cstp(this.$q, dataSet, true));

      this.responseAddCache[key] = this.$q.all(responsesPromise, childIdPromise).then(() => response);
    }

    return this.responseAddCache[key];
  }

  addAnswersToResponse(responseId, questionnaireId, answers) {
    delete this.responseGetCache[responseId];

    return this._getResponseByIdWithDataSet(responseId)
      .then(({response, dataSet}) => {
        response.questionnaires[questionnaireId] = answers;
        response.modified = moment().toISOString();

        return cbtp.call(dataSet, this.$q, dataSet.put, responseId, JSON.stringify(response)).then(() => ({
          dataSet,
          response
        }));
      })
      .then(({dataSet, response}) => cstp(this.$q, dataSet, true).then(() => response))
      .catch(e => {
        console.error(e.stack);
      });
  }
}

AnswersService.$inject = ['$q', 'UserService'];

export default angular.module('services.answers', ['ngStorage'])
  .service('AnswerService', AnswersService)
  .name;