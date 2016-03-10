'use strict';

import angular from 'angular';
import 'ngstorage';
import _ from 'lodash';
import Child from '../models/Child';
import moment from 'moment';
import 'angular-cookies';
import cbtp from '../util/cb-to-promise'

//import 'aws-sdk/dist/aws-sdk';
//const AWS = window.AWS;

AWS.config.region = 'us-east-1';

class UserService {
  constructor($cookies, $http, $q) {
    this.$cookies = $cookies;
    this.$http = $http;
    this.$q = $q;
  }

  init() {
    if (!this.initPromise) {
      const loginDetails = this.getLoginDetails();

      const identityParams = {
        IdentityPoolId: 'us-east-1:e6b4594e-c060-4fbe-81dc-0d56af9b8ad3'
      };
      if (loginDetails) {
        identityParams.IdentityId = loginDetails.IdentityId;
        identityParams.Logins = {
          'cognito-identity.amazonaws.com': loginDetails.Token
        }
      }
      AWS.config.credentials = new AWS.CognitoIdentityCredentials(identityParams);

      this.initPromise = cbtp.call(AWS.config.credentials, this.$q, AWS.config.credentials.refresh);
    }

    return this.initPromise;
  }

  login(token) {
    return this.$http.get(`https://www.dailycred.com/graph/me.json?access_token=${token}`)
      .then(response => response.data)
      .then(({access_token, email}) => this.$http.get(`https://ayzo3fhfm8.execute-api.us-east-1.amazonaws.com/test/cognito?token=${access_token}&email=${email}`))
      .then(response => response.data)
      .then(amazonDetails => {
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: 'us-east-1:e6b4594e-c060-4fbe-81dc-0d56af9b8ad3',
          IdentityId: amazonDetails.IdentityId,
          Logins: {
            'cognito-identity.amazonaws.com': amazonDetails.Token
          }
        });
        return cbtp.call(AWS.config.credentials, this.$q, AWS.config.credentials.refresh).then(() => amazonDetails);
      }).then((amazonDetails) => {
        this.$cookies.putObject('wmg-login', amazonDetails, {expires: moment().add(1, 'hours').toDate()});
      }).catch(err => console.error(err));
  }

  getLoginDetails() {
    return this.$cookies.getObject('wmg-login');
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