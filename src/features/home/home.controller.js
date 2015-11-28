'use strict';

import questions from '../../data/questionaires';

export default class HomeController {
  constructor() {
  }

  getQuestionnaires() {
    return questions;
  }

  getStatus(questionaire) {
    if (questionaire.id == "6months") {
      return "not_applicable"
    } else if (questionaire.id == "12months") {
      return "answered"
    } else if (questionaire.id == "18months") {
      return "not_answered"
    }
  }
}

HomeController.$inject = [];