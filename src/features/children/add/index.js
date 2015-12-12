'use strict';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import ChildService from '../../../services/child.service.js';
import AddChildController from './add_child.controller.js';

import './add_child.scss';


export default angular.module('app.add_child', [uirouter, ChildService, 'ngMaterial'])
  .controller('AddChildController', AddChildController)
  .name;