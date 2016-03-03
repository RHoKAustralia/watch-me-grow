'use strict';


export default class QuestionnaireController {
  constructor($stateParams, questionnaireService, answerService, $state, childService, ageService, $mdDialog) {
    this.questionnaire = questionnaireService.getQuestionnaire($stateParams.questionnaireId);
    this.$mdDialog = $mdDialog;

    childService.getChild($stateParams.childId).then(child => {
      this.child = child;
      this.age = ageService.getBestAge(this.child.getAgeInDays());

      // TODO: Reject if age is invalid for child or for questionnaire.
      if (!this.child) {
        this.$state.go('home');
      }
    });

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

  trySubmit($event) {
    $event.preventDefault();

    this.invalid = {};
    this.noComments = {};

    this.questionnaire.questions.forEach(question => {
      const valid = this.result[question.id] && this.result[question.id].answer;

      if (!valid) {
        this.invalid[question.id] = true;
        this.noComments[question.id] = true;
      } else {
        const noComments = question.comments && !this.result[question.id].comments;
        if (noComments) {
          this.noComments[question.id] = true;
        }
      }
    });


    if (!Object.keys(this.invalid).length) {
      if (Object.keys(this.noComments).length) {
        this.confirmNoCommentsDialog($event);
      } else {
        this.submit();
      }
    }
  }

  confirmNoCommentsDialog(ev) {
    var confirm = this.$mdDialog.confirm()
      .title('Not All Answers Have Comments')
      .textContent('At least one question didn\'t have comments left for it. It\'s recommended that you leave a comment ' +
        'for each answer. Are you sure you want to submit?')
      .ariaLabel('No Comments Confirmation')
      .targetEvent(ev)
      .ok('Submit Anyway')
      .cancel('Cancel and leave comments');

    this.$mdDialog.show(confirm).then(this.submit.bind(this));
  }

  submit() {
    this.answerService.addResult(this.child.id, this.questionnaire.id, this.age.id, this.result).then(() => {
      this.$state.go('dashboard', {childId: this.child.id});
    });
  }
}

QuestionnaireController.$inject = ['$stateParams', 'QuestionnaireService', 'AnswerService', '$state', 'ChildService', 'AgeService', '$mdDialog'];