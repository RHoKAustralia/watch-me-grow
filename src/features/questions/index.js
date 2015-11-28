'use strict';

import './questions.scss';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './questions.routes.js';
import QuestionsController from './questions.controller.js';
import QuestionnaireService from '../../services/questionnaire.service.js';
import AnswerService from '../../services/answer.service';
import ChildService from '../../services/child.service';

export default angular.module('app.questions', [uirouter, QuestionnaireService, AnswerService, ChildService])
  .config(routing)
  .controller('QuestionsController', QuestionsController)
  .name;