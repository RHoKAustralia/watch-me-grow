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

class AnswersService {
  constructor($q, userService) {
    this.$q = $q;
    this.userService = userService;
  }

  getResultsForChild(childId) {
    return this.getResultsWithDataSet(childId)
      .then(({result, dataSet}) => result)
  }

  getResultById(childId, id) {
    return this.getResultsForChild(childId)
      .then(results => results[id]);
  }

  addResult(childId, questionnaireId, ageId, answers) {
    const id = uuid.v1();

    return this.getResultsWithDataSet(childId)
      .then(({result, dataSet}) => {
        const toSave = {
          answers,
          questionnaireId,
          ageId,
          dateTime: moment().toISOString(),
          id
        };

        result[id] = toSave;

        return cbtp.call(dataSet, this.$q, dataSet.put, childId, JSON.stringify(result)).then(() => dataSet);
      })
      .then(dataSet => cstp(this.$q, dataSet, true))
      .catch(e => {
        console.error(e.stack);
      });
  }

  getResultsWithDataSet(childId) {
    return getDataSet('answers', this.userService, this.$q)
      .then(dataSet => {
        return cbtp.call(dataSet, this.$q, dataSet.get, childId).then(json => ({
          json,
          dataSet
        }));
      })
      .then(({json = '{}', dataSet}) => {
        return {
          result: _.mapValues(JSON.parse(json), rawAnswer => {
            return new QuestionnaireAnswer(rawAnswer);
          }),
          dataSet
        };
      });
  }
}

AnswersService.$inject = ['$q', 'UserService'];

export default angular.module('services.answers', ['ngStorage'])
  .service('AnswerService', AnswersService)
  .name;