'use strict';

import angular from 'angular';
import questionnaires from '../data/questionnaires';
import _ from 'lodash';

/**
 * Gets questionnaires from the questionnaires data json.
 */
class QuestionnaireService {
  constructor() {
    this.questionnaireIndex = _.keyBy(questionnaires, 'id');

    this.allQuestions = questionnaires.reduce((soFar, questionnaire) => {
      const questions = questionnaire.questions.map(question => Object.assign({}, question, {questionnaire}));
      return soFar.concat(questions);
    }, []);
  }

  getQuestionnaires() {
    return questionnaires;
  }

  getQuestionnaire(id) {
    return this.questionnaireIndex[id];
  }

  getQuestionCount() {
    return this.allQuestions.length;
  }

  getQuestionByNumber(number) {
    return this.allQuestions[number];
  }
}

export default angular.module('services.questions', [])
  .service('QuestionnaireService', QuestionnaireService)
  .name;