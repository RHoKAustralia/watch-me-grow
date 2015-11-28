'use strict';

routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('home', {
      url: '/dashboard/:childId',
      template: require('./home.html'),
      controller: 'HomeController',
      controllerAs: 'home'
    });
}