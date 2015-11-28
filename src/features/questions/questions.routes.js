'use strict';

routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('questions', {
      url: '/questions',
      template: require('./questions.html'),
      controller: 'QuestionsController',
      controllerAs: 'questions'
    });
}