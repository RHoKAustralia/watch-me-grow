'use strict';

import angular from 'angular';
import 'ngstorage';
import _ from 'lodash';
import Child from '../models/Child';

class ChildService {
  constructor($localStorage, $q) {
    this.$localStorage = $localStorage;
    this.$q = $q;
  }

  getChild(id) {
    return this.$q(resolve => resolve(new Child(this.$localStorage.child)));
  }

  setChild(child) {
    return this.$q(resolve => {
      this.$localStorage.child = child;

      resolve();
    });
  }
}

ChildService.$inject = ['$localStorage', '$q'];

export default angular.module('services.child', ['ngStorage'])
    .service('ChildService', ChildService)
    .name;