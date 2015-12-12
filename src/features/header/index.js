import './header.scss';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import HeaderController from './header.controller';

export default angular.module('app.header', [uirouter])
  .controller('HeaderController', HeaderController)
  .name;