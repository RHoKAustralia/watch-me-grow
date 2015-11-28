'use strict';

import questions from '../../data/questionaires';

export default class QuestionsController {
  constructor() {
  }

  getQuestions() {
    return questions;
  }
}

QuestionsController.$inject = [];