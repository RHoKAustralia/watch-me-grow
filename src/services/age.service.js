'use strict';

import angular from 'angular';
import ages from '../data/ages';
import _ from 'lodash';

/**
 * Queries the JSON file for the different age milestones that can be associated
 * with a child or a test result.
 */
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

  /** 
   * Gets the latest age milestone that applies for a child... e.g. if the available ages are 1 year and 18 months,
   * passing in 19 months returns 18 months, passing in 17 months returns 1 year.  
   */
  getBestAge(ageInDays) {
    return _.findLast(this.getAllAges(), age => ageInDays >= age.days);
  }
}

AgeService.$inject = [];

export default angular.module('services.age', [])
  .service('AgeService', AgeService)
  .name;