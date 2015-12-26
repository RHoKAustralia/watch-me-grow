'use strict';

import angular from 'angular';
import questions from '../data/questionnaires';
import _ from 'lodash';

class QuestionnaireService {
  constructor() {
    this.questionnaireIndex = _.indexBy(questions, 'id');
  }

  getQuestionnaires() {
    return questions;
  }

  getQuestionnaire(id) {
    return this.questionnaireIndex[id];
  }
}

export default angular.module('services.questions', [])
  .service('QuestionnaireService', QuestionnaireService)
  .name;