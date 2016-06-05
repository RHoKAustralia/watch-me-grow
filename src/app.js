import './base.scss';

import angular from 'angular';
import 'angular-aria/angular-aria';
import 'angular-animate/angular-animate';
import 'angular-material/angular-material';
import uirouter from 'angular-ui-router';

import root from './features/root'
import questionnaire from './features/questionnaire';
import landing from './features/landing';
import result from './features/result';
import enterDetails from './features/enter-details';
import userService from './services/user.service.localstorage';

import routing from './app.config';

angular.module('app', [uirouter, root, questionnaire, landing, result, enterDetails, 'ngMaterial', userService])
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
  ])
  .config(routing);