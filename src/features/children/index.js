'use strict';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './child.routes';
import ChildService from '../../services/child.service';
import ChildSelectionController from './child.controller';
import AddChild from './add';

import './child_selection.scss';


export default angular.module('app.children', [uirouter, ChildService, 'ngMaterial', AddChild])
  .config(routing)
  .controller('ChildSelectionController', ChildSelectionController)
  .name;