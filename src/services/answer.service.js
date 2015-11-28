'use strict';

import angular from 'angular';
import localDataStorage from 'angular-local-storage';

class Answers {
  constructor(localStorageService) {
    this.localStorageService = localStorageService
  }

  getAnswers(ageId, questionaireId) {
    return this.localStorageService.get(Answers.composeKey(ageId, questionaireId))
  }

  saveAnswers(ageId, questionaireId, answers) {
    return this.localStorageService.set(Answers.composeKey(ageId, questionaireId), answers)
  }

  static composeKey(ageId, questionaireId) {
    return "answer_" + ageId + "_" + questionaireId
  }
}

Answers.$inject = ["localStorageService"];

export default angular.module('services.answers', ['LocalStorageModule'])
  .service('AnswerService', Answers)
  .name;