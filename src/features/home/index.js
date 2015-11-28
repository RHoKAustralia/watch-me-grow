'use strict';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './home.routes';
import AnswerService from '../../services/answer.service';
import QuestionnaireService from '../../services/questionnaire.service';
import HomeController from './home.controller';

import './home.scss';


export default angular.module('app.home', [uirouter, AnswerService, QuestionnaireService])
  .config(routing)
  .controller('HomeController', HomeController)
  .name;