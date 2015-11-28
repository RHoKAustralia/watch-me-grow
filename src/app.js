
import 'material-design-lite/material.js';
import './base.scss';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import home from './features/home/index';
import questionnaire from './features/questionnaire';
import child_selection from './features/child_selection';
import add_child from './features/add_child';

import routing from './app.config';

angular.module('app', [uirouter, home, questionnaire, child_selection, add_child])
  .config(routing);