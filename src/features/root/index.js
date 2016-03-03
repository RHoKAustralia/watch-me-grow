import './root.scss';
import './header/header.scss';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './root.routes';
import RootController from './root.controller';
import HeaderController from '../root/header/header.controller';

/** Wraps around all pages in the app */
export default angular.module('app.root', [uirouter, 'ngMaterial'])
  .controller('RootController', RootController)
  .controller('HeaderController', HeaderController)
  .config(routing)
  .name;