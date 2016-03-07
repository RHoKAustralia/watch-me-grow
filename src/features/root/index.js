import './root.scss';
import './header/header.scss';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './root.routes';
import RootController from './root.controller';
import HeaderController from '../root/header/header.controller';
import UserService from '../../services/user.service';

/** Wraps around all pages in the app */
export default angular.module('app.root', [uirouter, 'ngMaterial', UserService])
  .controller('RootController', RootController)
  .controller('HeaderController', HeaderController)
  .config(routing)
  .name;