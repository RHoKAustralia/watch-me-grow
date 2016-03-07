'use strict';

import angular from 'angular';
import 'ngstorage';
import _ from 'lodash';
import Child from '../models/Child';
import moment from 'moment';
import 'angular-cookies';

class UserService {
  constructor($cookies) {
    this.$cookies = $cookies;
  }

  setToken(token, expiry) {
    const expiryMoment = moment().add(expiry, 'seconds');

    this.$cookies.put('wmg-login', token, {expires: expiryMoment.toDate()});
  }

  isLoggedIn() {
    return !!this.$cookies.get('wmg-login');
  }

  logout() {
    this.$cookies.remove('wmg-login');
  }
}

UserService.$inject = ['$cookies'];

export default angular.module('services.user', ['ngCookies'])
  .service('UserService', UserService)
  .name;