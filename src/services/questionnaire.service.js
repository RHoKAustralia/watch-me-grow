'use strict';

import angular from 'angular';
import questions from '../data/questionaires';
import ages from '../data/ages';
import _ from 'lodash';

class QuestionnaireService {
  constructor() {
    this.questionnaireIndex = _.indexBy(questions, 'id');
    this.agesIndex = _.indexBy(ages, 'id');
  }

  getQuestionnaires() {
    return questions;
  }

  getQuestionnaire(id) {
    return this.questionnaireIndex[id];
  }

  getBestAge(ageInDays, questionnaireId) {
    const questionnaire = this.getQuestionnaire(questionnaireId);

    const questionnaireAgeGroups = questionnaire.age_groups.map(age => this.agesIndex[age]);

    return _.findLast(questionnaireAgeGroups, ageGroup => ageInDays > ageGroup.days);
  }
}

QuestionnaireService.$inject = [];

export default angular.module('services.questions', [])
  .service('QuestionnaireService', QuestionnaireService)
  .name;