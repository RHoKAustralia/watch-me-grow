'use strict';

import angular from 'angular';

class Answers {
  constructor($localStorage) {
    this.$localStorage = $localStorage
  }

  getAnswers(childId, ageId, questionnaireId) {
    return this.$localStorage[Answers.composeKey(childId, ageId, questionnaireId)];
  }

  saveAnswers(childId, ageId, questionnaireId, answers) {
    return this.$localStorage[Answers.composeKey(childId, ageId, questionnaireId)] = answers;
  }

  static composeKey(childId, ageId, questionaireId) {
    return "answer_" + childId + '_' + ageId + "_" + questionaireId;
  }
}

Answers.$inject = ["$localStorage"];

export default angular.module('services.answers', ['ngStorage'])
  .service('AnswerService', Answers)
  .name;