'use strict';

import questions from '../../data/questionaires';

export default class HomeController {
  constructor() {
  }

  getQuestionnaires() {
    return questions;
  }
}

HomeController.$inject = [];