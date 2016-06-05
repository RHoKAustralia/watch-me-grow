'use strict';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import ChildService from '../../services/child.service.localstorage.js';
import EnterDetailsController from './enter-details.controller.js';
import routing from './enter-details.routes.js';

import './enter-details.scss';

/**
 * Dialog that adds a child to the user's data store.
 */
export default angular.module('app.add_child', [uirouter, ChildService, 'ngMaterial'])
  .config(routing)
  .controller('EnterDetailsController', EnterDetailsController)
  .name;