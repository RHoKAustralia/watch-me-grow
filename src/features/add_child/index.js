'use strict';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './add_child.routes';
import ChildService from '../../services/child.service';
import AddChildController from './add_child.controller';

import './add_child.scss';


export default angular.module('app.add_child', [uirouter, ChildService])
  .config(routing)
  .controller('AddChildController', AddChildController)
  .name;