
import 'material-design-lite/material.js';
import './base.scss';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import home from './features/home/index';
import questionnaire from './features/questionnaire/index';
import child_selection from './features/child_selection/index';
import add_child from './features/add_child/index';
import result from './features/result/index';

import routing from './app.config';

angular.module('app', [uirouter, home, questionnaire, child_selection, add_child, result])
  .config(routing);