'use strict';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import PostLoginController from './postLogin.controller'
import UserService from '../../services/user.service';
import routing from './postLogin.routes.js';

export default angular.module('app.postLogin', [uirouter, UserService])
  .config(routing)
  .controller('PostLoginController', PostLoginController)
  .name;