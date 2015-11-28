'use strict';

routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('questions', {
      url: '/questions/:questionnaireId?childId&ageId',
      template: require('./questions.html'),
      controller: 'QuestionsController',
      controllerAs: 'controller'
    });
}