'use strict';

import angular from 'angular';

class Answers {
  constructor($localStorage) {
    this.$localStorage = $localStorage
  }

  getAnswers(childId, ageId, questionaireId) {
    return this.$localStorage[Answers.composeKey(childId, ageId, questionaireId)];
  }

  saveAnswers(childId, ageId, questionaireId, answers) {
    return this.$localStorage[Answers.composeKey(childId, ageId, questionaireId)] = answers;
  }

  static composeKey(childId, ageId, questionaireId) {
    return "answer_" + childId + '_' + ageId + "_" + questionaireId;
  }
}

Answers.$inject = ["$localStorage"];

export default angular.module('services.answers', ['ngStorage'])
  .service('AnswerService', Answers)
  .name;