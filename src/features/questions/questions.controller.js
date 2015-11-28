'use strict';


export default class QuestionsController {
  constructor($stateParams, questionsService, answerService, $location, $state) {
    this.answerService = answerService;
    this.questionnaire = questionsService.getQuestions($stateParams.questionnaireId);
    this.answers = {};
    this.ageId = $location.search['ageId'];
    this.$state = $state;

    // TODO: Reject if age is invalid for child or for questionnaire.
  }

  submit() {
    this.answerService.saveAnswers(this.ageId, this.questionnaire.id, this.answers);

    this.$state.go('home');
  }
}

QuestionsController.$inject = ['$stateParams', 'QuestionsService', 'AnswerService', '$location', '$state'];