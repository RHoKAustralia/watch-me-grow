'use strict';

import './questions.scss';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './questions.routes.js';
import QuestionsController from './questions.controller.js';
import QuestionsService from '../../services/questions.service';
import AnswerService from '../../services/answer.service';

export default angular.module('app.questions', [uirouter, QuestionsService, AnswerService])
  .config(routing)
  .controller('QuestionsController', QuestionsController)
  .name;