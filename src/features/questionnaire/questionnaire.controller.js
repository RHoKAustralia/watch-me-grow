'use strict';


export default class QuestionnaireController {
  constructor($stateParams, questionnaireService, answerService, $state, childService) {
    this.childId = $stateParams.childId;
    this.child = childService.getChild(this.childId);
    this.questionnaire = questionnaireService.getQuestionnaire($stateParams.questionnaireId);

    // TODO: Reject if age is invalid for child or for questionnaire.
    if (!this.child) {
      this.$state.go('home');
      return;
    } else {
      this.ageId = questionnaireService.getBestAge(this.child.getAgeInDays(), this.questionnaire.id);
    }

    this.answerService = answerService;
    this.answers = {};
    this.$state = $state;
    this.invalid = {};
  }

  submit($event) {
    $event.preventDefault();

    this.invalid = {};
    this.questionnaire.questions.forEach(question => {
      if (!this.answers[question.id]) {
        this.invalid[question.id] = true;
      }
    });

    if (!Object.keys(this.invalid).length) {
      this.answerService.saveAnswers(this.childId, this.ageId.id, this.questionnaire.id, this.answers);

      this.$state.go('dashboard', {childId: this.childId});
    }
  }
}

QuestionnaireController.$inject = ['$stateParams', 'QuestionnaireService', 'AnswerService', '$state', 'ChildService'];