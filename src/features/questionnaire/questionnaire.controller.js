'use strict';


export default class QuestionnaireController {
  constructor($stateParams, questionnaireService, answerService, $state, childService, ageService) {
    this.child = childService.getChild($stateParams.childId);
    this.questionnaire = questionnaireService.getQuestionnaire($stateParams.questionnaireId);
    this.age = ageService.getBestAge(this.child.getAgeInDays());

    // TODO: Reject if age is invalid for child or for questionnaire.
    if (!this.child) {
      this.$state.go('home');
      return;
    }

    this.answerService = answerService;
    this.result = {};
    this.$state = $state;
    this.invalid = {};
  }

  getHeaderTitle() {
    if (this.questionnaire && this.age && this.child) {
      return this.questionnaire.title + ' - ' + this.child.name + '(' + this.age.label + ')';
    }
  }

  submit($event) {
    $event.preventDefault();

    this.invalid = {};
    this.questionnaire.questions.forEach(question => {
      const valid = this.result[question.id] &&
          this.result[question.id].answer &&
          (!question.comments || this.result[question.id].comments);

      if (!valid) {
        this.invalid[question.id] = true;
      }
    });

    if (!Object.keys(this.invalid).length) {
      this.answerService.addResult(this.child.id, this.questionnaire.id, this.age.id, this.result);

      this.$state.go('dashboard', {childId: this.child.id});
    }
  }
}

QuestionnaireController.$inject = ['$stateParams', 'QuestionnaireService', 'AnswerService', '$state', 'ChildService', 'AgeService'];