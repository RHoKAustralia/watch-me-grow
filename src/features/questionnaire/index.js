'use strict';

import './questionnaire.scss';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './questionnaire.routes.js';
import QuestionsController from './questionnaire.controller.js';
import QuestionnaireService from '../../services/questionnaire.service.js';
import AnswerService from '../../services/answer.service';
import ChildService from '../../services/child.service';
import AgeService from '../../services/age.service';

export default angular.module('app.questionnaire', [uirouter, QuestionnaireService, AnswerService, ChildService, AgeService, 'ngMaterial'])
  .config(routing)
  .controller('QuestionnaireController', QuestionsController)
  .name;