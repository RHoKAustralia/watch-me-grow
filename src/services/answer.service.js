'use strict';

import angular from 'angular';
import _ from 'lodash';
import moment from 'moment';
import QuestionnaireAnswer from '../models/questionnaire-answer';

class AnswersService {
  constructor($localStorage) {
    this.$localStorage = $localStorage
  }

  getAnswersForChild(childId) {
    const rawChildAnswers = this.$localStorage[AnswersService.composeKey(childId)];

    if (rawChildAnswers) {
      return Object.keys(rawChildAnswers).reduce((acc, key) => {
        acc[key] = new QuestionnaireAnswer(rawChildAnswers[key]);
        return acc;
      }, {});
    }
  }

  addAnswers(childId, questionnaireId, ageId, answers) {
    const now = moment().toISOString();
    const toSave = {
      answers,
      questionnaireId,
      ageId,
      dateTime: now
    };

    const answersForChild = this.getAnswersForChild(childId) || {};
    answersForChild[now] = toSave;

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