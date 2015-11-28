'use strict';


export default class QuestionnaireController {
  constructor($stateParams, questionsService, answerService, $state, childService, $location) {
    this.answerService = answerService;
    this.questionnaire = questionsService.getQuestionnaire($stateParams.questionnaireId);
    this.answers = {};
    this.$state = $state;
    this.childId = $location.search.childId;
    this.ageId = $location.search.ageId;

    // TODO: Reject if age is invalid for child or for questionnaire.
    if (!childService.getChild(this.childId)) {
      this.$state.go('home');
    }
  }

  submit() {
    this.answerService.saveAnswers(this.childId, this.ageId, this.questionnaire.id, this.answers);

    this.$state.go('home');
  }
}

QuestionnaireController.$inject = ['$stateParams', 'QuestionnaireService', 'AnswerService', '$state', 'ChildService', '$location'];