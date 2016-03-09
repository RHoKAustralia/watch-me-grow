'use strict';

import angular from 'angular';
import 'ngstorage';
import _ from 'lodash';
import Child from '../models/Child';
import moment from 'moment';
import 'angular-cookies';
import 'aws-sdk/dist/aws-sdk';
const AWS = window.AWS;

class UserService {
  constructor($cookies) {
    this.$cookies = $cookies;
  }

  init() {
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
  }

  login(token) {
    return fetch(`https://www.dailycred.com/graph/me.json?access_token=${token}`)
      .then(response => response.json())
      .then(({access_token, email}) => {
        return fetch(`https://ayzo3fhfm8.execute-api.us-east-1.amazonaws.com/test/cognito?token=${access_token}&email=${email}`)
          .then(response => response.json())
          .then(amazonDetails => Object.assign(amazonDetails, {access_token, email}));
      }).then(allDetails => {
        AWS.config.credentials.params.Logins = {
          'dailycred.watchmegrow': allDetails.email
        };
        AWS.config.credentials.IdentityId = allDetails.IdentityId;
        AWS.config.credentials.expired = true;
        return new Promise((resolve, reject) => {
          AWS.config.credentials.get(err => {
            if (err) {
              reject(err);
            } else {
              resolve(allDetails);
            }
          });
        });
      }).then(allDetails => {
        this.$cookies.putObject('wmg-login', allDetails, {expires: moment().add(1, 'day').toDate()});
      });
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

UserService.$inject = ['$cookies'];

export default angular.module('services.user', ['ngCookies'])
  .service('UserService', UserService)
  .name;