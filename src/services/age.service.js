'use strict';

import angular from 'angular';
import ages from '../data/ages';
import _ from 'lodash';

class AgeService {
  constructor() {
    this.agesIndex = _.keyBy(ages, 'id');
  }

  getAllAges() {
    return ages;
  }

  getAgeById(id) {
    return this.agesIndex[id];
  }

  getBestAge(ageInDays) {
    return _.findLast(this.getAllAges(), age => ageInDays >= age.days);
  }
}

AgeService.$inject = [];

export default angular.module('services.age', [])
  .service('AgeService', AgeService)
  .name;