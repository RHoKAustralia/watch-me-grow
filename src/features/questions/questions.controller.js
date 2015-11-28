'use strict';

import questions from '../../data/questionaires';

export default class QuestionsController {
  constructor() {
  }

  getQuestions() {
    return questions[0];
  }
}

QuestionsController.$inject = [];