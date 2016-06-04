'use strict';

import angular from 'angular';
import 'ngstorage';
import _ from 'lodash';
import Child from '../models/Child';

class UserService {
  constructor($timeout) {
    this.$timeout = $timeout;
  }

  setToken(token, expiry) {
    const expiryTimer = this.$timeout(() => {
      this.currentLogin = undefined;
    });
    this.currentLogin = {token, expiry, expiryTimer};
  }

  isLoggedIn() {
    return !!this.currentLogin;
  }
}

UserService.$inject = ['$timeout'];

export default angular.module('services.user', [])
    .service('UserService', UserService)
    .name;