'use strict';

import angular from 'angular';
import localDataStorage from 'angular-local-storage';

class Answers {
  constructor(localStorageService) {
    this.localStorageService = localStorageService
  }

  getAnswers(age, questionaire) {
    return this.localStorageService.get(Answers.composeKey(age, questionaire))
  }

  saveAnswers(age, questionaire, answers) {
    return this.localStorageService.set(Answers.composeKey(age, questionaire), answers)
  }

  static composeKey(age, questionaire) {
    return "answer_" + age.id + "_" + questionaire.id
  }
}

Answers.$inject = ["localStorageService"];

export default angular.module('services.answers', ['LocalStorageModule'])
  .service('AnswerService', Answers)
  .name;