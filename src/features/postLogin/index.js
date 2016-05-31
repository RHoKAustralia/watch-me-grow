'use strict';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import PostLoginController from './postLogin.controller'
import UserService from '../../services/user.service';
import routing from './postLogin.routes.js';

/**
 * Non-visual module that is redirected to after the login through DailyCred and completes the login process by initialising
 * an Amazon Cognito identity for the authenticated user (this might mean creating a new one or getting an existing one).
 * 
 * After this is finished, it redirects back home.
 */
export default angular.module('app.postLogin', [uirouter, UserService])
  .config(routing)
  .controller('PostLoginController', PostLoginController)
  .name;