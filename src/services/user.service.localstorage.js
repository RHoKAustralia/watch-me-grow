'use strict';

import angular from 'angular';
import 'ngstorage';
import _ from 'lodash';
import Child from '../models/Child';

class UserService {
  constructor($q, $localStorage) {
    this.$q = $q;
    this.$localStorage = $localStorage;
  }

  getUserDetails() {
    return this.$q(resolve => this.$localStorage.user);
  }

  setUserDetails(userDetails) {
    return this.$q(resolve => {
      this.$localStorage.user = userDetails;
      resolve();
    });
  }
}

UserService.$inject = ['$q', '$localStorage'];

export default angular.module('services.user', ['ngStorage'])
    .service('UserService', UserService)
    .name;