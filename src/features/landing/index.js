'use strict';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './landing.routes.js';
import ChildService from '../../services/child.service.localstorage';
import LandingController from './landing.controller.js';
import EnterDetails from '../enter-details';
import UserService from '../../services/user.service.localstorage';

import './landing.scss';

/**
 * Shows all the children created by the user, allowing the user to create more or view the dashboard of an individual
 * child.
 */
export default angular.module('app.landing', [uirouter, ChildService, 'ngMaterial', EnterDetails, UserService])
  .config(routing)
  .controller('LandingController', LandingController)
  .name;