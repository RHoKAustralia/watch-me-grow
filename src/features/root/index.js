import './root.scss';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './root.routes';
import RootController from './root.controller';
import header from '../header';

/** Wraps around all pages in the app */
export default angular.module('app.root', [uirouter, header])
  .controller('RootController', RootController)
  .config(routing)
  .name;