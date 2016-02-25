'use strict';

import angular from 'angular';
import _ from 'lodash';
import moment from 'moment';
import QuestionnaireAnswer from '../models/result';
import uuid from 'node-uuid';

class AnswersService {
  constructor($localStorage, $q) {
    this.$localStorage = $localStorage
    this.$q = $q;
  }

  getResultsForChild(childId) {
    return this.$q((resolve, reject) => {
      const rawChildAnswers = this.$localStorage[AnswersService.composeKey(childId)];

      if (rawChildAnswers) {
        resolve(Object.keys(rawChildAnswers).reduce((acc, key) => {
          acc[key] = new QuestionnaireAnswer(rawChildAnswers[key]);
          return acc;
        }, {}));
      }
    });
  }

  getResultById(childId, id) {
    return this.$q((resolve, reject) => {
      const rawChildAnswers = this.$localStorage[AnswersService.composeKey(childId)];

      if (rawChildAnswers && rawChildAnswers[id]) {
        resolve(new QuestionnaireAnswer(rawChildAnswers[id]));
      }
    });
  }

  addResult(childId, questionnaireId, ageId, answers) {
    const id = uuid.v1();

    return this.$q((resolve) => {
      resolve(this.getResultsForChild(childId));
    }).then((answersForChild = {}) => {
      const toSave = {
        answers,
        questionnaireId,
        ageId,
        dateTime: moment().toISOString(),
        id
      };

      answersForChild[id] = toSave;

      this.$localStorage[AnswersService.composeKey(childId)] = answersForChild;
    });
  }

  static composeKey(childId) {
    return "answers_" + childId;
  }
}

AnswersService.$inject = ['$localStorage', '$q'];

export default angular.module('services.answers', ['ngStorage'])
  .service('AnswerService', AnswersService)
  .name;