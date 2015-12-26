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

import routing from './app.config';

angular.module('app', [uirouter, root, home, questionnaire, children, result, 'ngMaterial'])
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('indigo')
      .accentPalette('orange');
  })
  .config(routing);