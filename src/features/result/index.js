'use strict';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './result.routes';
import ChildService from '../../services/child.service';
import AnswerService from '../../services/answer.service';
import ResultController from './result.controller';

import './result.scss';


export default angular.module('app.result', [uirouter, ChildService, AnswerService])
  .config(routing)
  .controller('ResultController', ResultController)
  .name;