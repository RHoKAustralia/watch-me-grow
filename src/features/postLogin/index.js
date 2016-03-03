'use strict';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './postLogin.routes.js';

export default angular.module('app.postLogin', [uirouter])
  .config(routing)
  .name;