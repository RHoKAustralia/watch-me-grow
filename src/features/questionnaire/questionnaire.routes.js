'use strict';

import defineHeader from '../header/define-header';

routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('questionnaire', {
      url: 'questionnaire/:questionnaireId?{childId:int}',
      parent: 'root',
      views: {
        '': {
          template: require('./questionnaire.html'),
          controller: 'QuestionnaireController',
          controllerAs: 'controller'
        },
        'header@root': defineHeader('QuestionnaireController')
      }
    });
}