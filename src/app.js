
import 'material-design-lite/material.js';
import './base.scss';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import home from './features/home/index';
import questions from './features/questions/index';
import child_selection from './features/child_selection/index';
import add_child from './features/add_child/index';

import routing from './app.config';

angular.module('app', [uirouter, home, questions, child_selection, add_child])
  .config(routing);