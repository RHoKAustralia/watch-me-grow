'use strict';

import defineHeader from '../root/header/define-header';

routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('questionnaire', {
      url: 'questionnaire/:questionnaireId?{childId:string}',
      parent: 'root',
      views: defineHeader({
        '': {
          template: require('./questionnaire.html'),
          controller: 'QuestionnaireController',
          controllerAs: 'controller'
        }
      }, 'QuestionnaireController')
    });
}