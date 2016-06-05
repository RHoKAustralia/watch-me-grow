'use strict';

import angular from 'angular';
import addHeader from '../root/header/define-header';

routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('landing', {
      url: 'landing',
      parent: 'root',
      views: addHeader({
        '': {
          template: require('./landing.html'),
          controller: 'LandingController',
          controllerAs: 'controller'
        }
      }, 'LandingController')
    });
}