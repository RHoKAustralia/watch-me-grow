'use strict';

import angular from 'angular';
import localDataStorage from 'angular-local-storage';

class Answers {
  constructor(localStorageService) {
    this.localStorageService = localStorageService
  }

  getAnswers(childId, ageId, questionaireId) {
    return this.localStorageService.get(Answers.composeKey(childId, ageId, questionaireId));
  }

  saveAnswers(childId, ageId, questionaireId, answers) {
    return this.localStorageService.set(Answers.composeKey(childId, ageId, questionaireId), answers);
  }

  static composeKey(childId, ageId, questionaireId) {
    return "answer_" + childId + '_' + ageId + "_" + questionaireId;
  }
}

Answers.$inject = ["localStorageService"];

export default angular.module('services.answers', ['LocalStorageModule'])
  .service('AnswerService', Answers)
  .name;