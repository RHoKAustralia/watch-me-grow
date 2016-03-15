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

AWS.config.region = 'us-east-1';

class UserService {
  constructor($cookies, $http, $q) {
    this.$cookies = $cookies;
    this.$http = $http;
    this.$q = $q;
    this.handlingExpiry = false;
    this.loggingIn = false;
  }

  init() {
    const credsExpired = AWS.config.credentials && AWS.config.credentials.expired && !this.handlingExpiry;

    if (!this.initPromise || credsExpired) {
      const loginDetails = this.getLoginDetails();

      this.initPromise = (loginDetails ? this.initCognito(loginDetails.accessToken, loginDetails.email) : this.loginAnon());

      if (credsExpired) {
        this.handlingExpiry = true;
        this.initPromise.finally(() => {
          this.handlingExpiry = false;
        });
      }
    }

    return this.initPromise;
  }

  loginAnon() {
    this.loggingIn = true;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'us-east-1:e6b4594e-c060-4fbe-81dc-0d56af9b8ad3'
    });

    return cbtp.call(AWS.config.credentials, this.$q, AWS.config.credentials.refresh).finally(() => this.loggingIn = false);
  }

  initCognito(accessToken, email) {
    this.loggingIn = true;
    return this.$http.get(`https://ayzo3fhfm8.execute-api.us-east-1.amazonaws.com/test/cognito?token=${accessToken}&email=${email}`)
      .then(response => response.data)
      .then(amazonDetails => {
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: 'us-east-1:e6b4594e-c060-4fbe-81dc-0d56af9b8ad3',
          IdentityId: amazonDetails.IdentityId,
          Logins: {
            'cognito-identity.amazonaws.com': amazonDetails.Token
          },
          LoginHint: email
        });
        return cbtp.call(AWS.config.credentials, this.$q, AWS.config.credentials.refresh);
      }).finally(() => this.loggingIn = false);
  }

  login(accessToken) {
    return this.$http.get(`https://www.dailycred.com/graph/me.json?access_token=${accessToken}`)
      .then(response => response.data)
      .then(({access_token, email}) => {
        const loginDetails = {accessToken: access_token, email};
        this.$cookies.putObject('wmg-login', loginDetails, {expires: moment().add(1, 'day').toDate()});
        this.initPromise = undefined;
        return loginDetails;
      })
      .then(({accessToken, email}) => this.initCognito(accessToken, email))
      .catch(err => console.error(err));
  }

  getLoginDetails() {
    return this.$cookies.getObject('wmg-login');
  }

  isLoggedIn() {
    return !!this.$cookies.get('wmg-login');
  }

  clearCredentials() {
    AWS.config.credentials && AWS.config.credentials.clearCachedId();
  }

  logout() {
    this.clearCredentials();

    this.$cookies.remove('wmg-login');
    this.initPromise = undefined;
  }
}

UserService.$inject = ['$cookies', '$http', '$q'];

export default angular.module('services.user', ['ngCookies'])
  .service('UserService', UserService)
  .name;