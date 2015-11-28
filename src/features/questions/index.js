'use strict';

import './questions.scss';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './questions.routes.js';
import QuestionsController from './questions.controller.js';

export default angular.module('app.questions', [uirouter])
  .config(routing)
  .controller('QuestionsController', QuestionsController)
  .name;