'use strict';

routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('questionnaire', {
      url: 'questionnaire/:questionnaireId?{childId:int}',
      template: require('./questionnaire.html'),
      controller: 'QuestionnaireController',
      controllerAs: 'controller',
      data: {
        title: 'Questionnaire'
      },
      parent: 'root'
    });
}