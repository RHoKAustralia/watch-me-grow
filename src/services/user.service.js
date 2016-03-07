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

  login(token) {
    return fetch(`https://www.dailycred.com/graph/me.json?access_token=${token}`)
      .then(response => response.json())
      .then(({access_token, email}) => {
        return fetch(`https://ayzo3fhfm8.execute-api.us-east-1.amazonaws.com/test/cognito?token=${access_token}&email=${email}`)
          .then(response => response.json())
          .then(amazonDetails => Object.assign(amazonDetails, {access_token, email}));
      }).then(allDetails => this.$cookies.putObject('wmg-login', allDetails, {expires: moment().add(1, 'day').toDate()}));
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