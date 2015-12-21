'use strict';

import angular from 'angular';
import ages from '../data/ages';
import _ from 'lodash';

class AgesService {
  constructor() {
    this.agesIndex = _.indexBy(ages, 'id');
  }

  getAllAges() {
    return ages;
  }

  getAgeById(id) {
    return this.agesIndex[id];
  }
}

AgesService.$inject = [];

export default angular.module('services.ages', [])
  .service('AgesService', AgesService)
  .name;