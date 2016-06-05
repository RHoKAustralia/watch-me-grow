'use strict';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './result.routes';
import QuestionnaireService from '../../services/questionnaire.service.js';
import AnswerService from '../../services/answer.service.localstorage';
import ResultController from './result.controller';

import './result.scss';

/**
 * Shows the result of a response (a set of questionnaires).
 */
export default angular.module('app.result', [uirouter, QuestionnaireService, AnswerService])
  .config(routing)
  .controller('ResultController', ResultController)
  .name;