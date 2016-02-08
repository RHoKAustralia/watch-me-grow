'use strict';

import angular from 'angular';
import _ from 'lodash';
import moment from 'moment';
import QuestionnaireAnswer from '../models/result';
import uuid from 'node-uuid';

class AnswersService {
  constructor($localStorage) {
    this.$localStorage = $localStorage
  }

  getResultsForChild(childId) {
    const rawChildAnswers = this.$localStorage[AnswersService.composeKey(childId)];

    if (rawChildAnswers) {
      return Object.keys(rawChildAnswers).reduce((acc, key) => {
        acc[key] = new QuestionnaireAnswer(rawChildAnswers[key]);
        return acc;
      }, {});
    }
  }

  getResultById(childId, id) {
    const rawChildAnswers = this.$localStorage[AnswersService.composeKey(childId)];

    if (rawChildAnswers && rawChildAnswers[id]) {
      return new QuestionnaireAnswer(rawChildAnswers[id]);
    }
  }

  addResult(childId, questionnaireId, ageId, answers) {
    const id = uuid.v1();

    const toSave = {
      answers,
      questionnaireId,
      ageId,
      dateTime: moment().toISOString(),
      id
    };
    const answersForChild = this.getResultsForChild(childId) || {};
    answersForChild[id] = toSave;

    this.$localStorage[AnswersService.composeKey(childId)] = answersForChild;
  }

  static composeKey(childId) {
    return "answers_" + childId;
  }
}

AnswersService.$inject = ["$localStorage"];

export default angular.module('services.answers', ['ngStorage'])
  .service('AnswerService', AnswersService)
  .name;