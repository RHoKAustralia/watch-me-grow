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

/**
 * Shows a questionnaire to the user, validates their responses then submits. After submit the result might be to go to
 * the next questionnaire or to view results.
 */
export default angular.module('app.questionnaire', [uirouter, QuestionnaireService, AnswerService, ChildService, AgeService, 'ngMaterial'])
  .config(routing)
  .controller('QuestionnaireController', QuestionsController)
  .name;