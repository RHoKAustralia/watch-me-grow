'use strict';

import angular from 'angular';
import questions from '../data/questionaires';
import _ from 'lodash';

class Questions {
  constructor() {
    this.questionIndex = _.indexBy(questions, 'id');
  }

  getQuestions(id) {
    return this.questionIndex[id];
  }
}

Questions.$inject = [];

export default angular.module('services.questions', [])
  .service('QuestionsService', Questions)
  .name;