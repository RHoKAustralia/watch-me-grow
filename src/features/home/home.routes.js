'use strict';

routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('home', {
      url: '/dashboard/{childId:int}',
      template: require('./home.html'),
      controller: 'HomeController',
      controllerAs: 'home'
    });
}