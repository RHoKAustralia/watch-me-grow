'use strict';

routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('questionnaire', {
      url: '/questionnaire/:questionnaireId/:ageId?childId',
      template: require('./questionnaire.html'),
      controller: 'QuestionnaireController',
      controllerAs: 'controller'
    });
}