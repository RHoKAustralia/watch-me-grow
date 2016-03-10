'use strict';

import angular from 'angular';
import 'ngstorage';
import _ from 'lodash';
import Child from '../models/Child';
import moment from 'moment';
import 'angular-cookies';
import cbtp from '../util/cb-to-promise'

import 'aws-sdk/dist/aws-sdk';
const AWS = window.AWS;

class UserService {
  constructor($cookies, $http, $q) {
    this.$cookies = $cookies;
    this.$http = $http;
    this.$q = $q;
  }

  init() {
    if (!this.initPromise) {
      const params = {
        region: 'us-east-1',
        credentials: new AWS.CognitoIdentityCredentials({
          AccountId: '754729660372',
          IdentityPoolId: 'us-east-1:e6b4594e-c060-4fbe-81dc-0d56af9b8ad3'
        })
      };

      const loginDetails = this.getLoginDetails();
      params.credentials.RoleArn = loginDetails ? 'arn:aws:iam::754729660372:role/Cognito_WatchMeGrowAuth_Role' :
        'arn:aws:iam::754729660372:role/Cognito_WatchMeGrowUnauth_Role';
      params.credentials.IdentityId = loginDetails && loginDetails.IdentityId;
      params.credentials.expired = true;

      AWS.config.update(params);

      this.initPromise = cbtp.call(AWS.config.credentials, this.$q, AWS.config.credentials.get);
    }

    return this.initPromise;
  }

  login(token) {
    return this.$http.get(`https://www.dailycred.com/graph/me.json?access_token=${token}`)
      .then(response => response.data)
      .then(({access_token, email}) => this.$http.get(`https://ayzo3fhfm8.execute-api.us-east-1.amazonaws.com/test/cognito?token=${access_token}&email=${email}`))
      .then(response => response.data)
      .then(amazonDetails => amazonDetails.IdentityId)
      .then(identityId => {
        AWS.config.credentials.IdentityId = identityId;
        AWS.config.credentials.expired = true;
        return cbtp.call(AWS.config.credentials, this.$q, AWS.config.credentials.get)
      }).then(() => {
        this.$cookies.put('wmg-login', AWS.config.credentials.IdentityId, {expires: moment().add(1, 'day').toDate()});
      });
  }

  getLoginDetails() {
    return this.$cookies.get('wmg-login');
  }

  isLoggedIn() {
    return !!this.$cookies.get('wmg-login');
  }

  logout() {
    this.$cookies.remove('wmg-login');
  }
}

UserService.$inject = ['$cookies', '$http', '$q'];

export default angular.module('services.user', ['ngCookies'])
  .service('UserService', UserService)
  .name;