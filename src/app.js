import './base.scss';

import angular from 'angular';
import 'angular-aria/angular-aria';
import 'angular-animate/angular-animate';
import 'angular-material/angular-material';
import uirouter from 'angular-ui-router';

import root from './features/root'
import home from './features/dashboard';
import questionnaire from './features/questionnaire';
import children from './features/children';
import result from './features/result/index';
import postLogin from './features/postLogin';
import userService from './services/user.service';

import routing from './app.config';

import 'aws-sdk/dist/aws-sdk';
const AWS = window.AWS;



angular.module('app', [uirouter, root, home, questionnaire, children, result, 'ngMaterial', postLogin, userService])
  .config(['$mdThemingProvider', function ($mdThemingProvider) {
    // Extend the red theme with a few different colors
    var wmgCyan = $mdThemingProvider.extendPalette('cyan', {
      'contrastDefaultColor': 'dark'
    });
    // Register the new color palette map with the name <code>neonRed</code>
    $mdThemingProvider.definePalette('wmgCyan', wmgCyan);
    // Use that theme for the primary intention

    $mdThemingProvider.theme('default')
      .primaryPalette('wmgCyan')
      .accentPalette('orange');
  }])
  .config([
    '$compileProvider',
    function ($compileProvider) {
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data):/);
    }
  ]).run(['UserService', userService => {
    AWS.config.update({
      region: 'us-east-1',
      credentials: new AWS.CognitoIdentityCredentials({
        AccountId: '754729660372',
        RoleArn: 'arn:aws:iam::754729660372:role/Cognito_WatchMeGrowUnauth_Role',
        IdentityPoolId: 'us-east-1:e6b4594e-c060-4fbe-81dc-0d56af9b8ad3'
      })
    });
  }])
  .config(routing);