import 'material-design-lite/material.js';
import './base.scss';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import root from './features/root'
import home from './features/home';
import questionnaire from './features/questionnaire';
import child_selection from './features/child_selection';
import add_child from './features/add_child';
import result from './features/result/index';

import routing from './app.config';

angular.module('app', [uirouter, root, home, questionnaire, child_selection, add_child, result])
  .run(function ($rootScope, $timeout) {
    $rootScope.$on('$viewContentLoaded', ()=> {
      $timeout(() => {
        componentHandler.upgradeAllRegistered();
      })
    })
  })
  .config(routing);