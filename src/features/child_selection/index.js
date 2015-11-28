'use strict';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './child_selection.routes';
import ChildService from '../../services/child.service';
import ChildSelectionController from './child.controller';

import './child_selection.scss';


export default angular.module('app.child_selection', [uirouter, ChildService])
  .config(routing)
  .controller('ChildSelectionController', ChildSelectionController)
  .name;