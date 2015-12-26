'use strict';

import angular from 'angular';
import ages from '../data/ages';
import _ from 'lodash';

class AgeService {
  constructor() {
    this.agesIndex = _.indexBy(ages, 'id');
  }

  getAllAges() {
    return ages;
  }

  getAgeById(id) {
    return this.agesIndex[id];
  }

  getBestAge(ageInDays, questionnaire) {
    const questionnaireAgeGroups = questionnaire.age_groups.map(ageId => this.getAgeById(ageId));

    return _.findLast(questionnaireAgeGroups, ageGroup => ageInDays >= ageGroup.days);
  }
}

AgeService.$inject = [];

export default angular.module('services.age', [])
  .service('AgeService', AgeService)
  .name;