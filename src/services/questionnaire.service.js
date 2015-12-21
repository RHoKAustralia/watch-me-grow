'use strict';

import angular from 'angular';
import questions from '../data/questionnaires';
import ageService from './age.service';
import _ from 'lodash';

class QuestionnaireService {
  constructor(ageService) {
    this.ageService = ageService;
    this.questionnaireIndex = _.indexBy(questions, 'id');
  }

  getQuestionnaires() {
    return questions;
  }

  getQuestionnaire(id) {
    return this.questionnaireIndex[id];
  }

  getBestAge(ageInDays, questionnaireId) {
    const questionnaire = this.getQuestionnaire(questionnaireId);

    const questionnaireAgeGroups = questionnaire.age_groups.map(ageId => this.ageService.getAgeById(ageId));

    return _.findLast(questionnaireAgeGroups, ageGroup => ageInDays > ageGroup.days);
  }
}

QuestionnaireService.$inject = ['AgesService'];

export default angular.module('services.questions', [ageService])
  .service('QuestionnaireService', QuestionnaireService)
  .name;