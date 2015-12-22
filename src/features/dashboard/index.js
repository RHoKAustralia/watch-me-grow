'use strict';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './dashboard.routes';
import AnswerService from '../../services/answer.service';
import QuestionnaireService from '../../services/questionnaire.service';
import HomeController from './dashboard.controller';

import './dashboard.scss';


export default angular.module('app.dashboard', [uirouter, AnswerService, QuestionnaireService])
  .config(routing)
  .controller('DashboardController', HomeController)
  .name;