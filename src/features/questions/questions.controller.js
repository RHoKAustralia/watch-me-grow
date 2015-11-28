'use strict';


export default class QuestionsController {
  constructor($stateParams, questionsService) {
    this.questions = questionsService.getQuestions($stateParams.questionnaireId);
  }

  getQuestions() {
    return this.questions;
  }
}

QuestionsController.$inject = ['$stateParams', 'QuestionsService'];