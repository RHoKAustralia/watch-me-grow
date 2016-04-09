'use strict';

import _ from 'lodash';

export default class QuestionnaireController {
  constructor($stateParams, questionnaireService, answerService, $state, childService, ageService, $mdDialog) {
    this.questionnaires = _.indexBy(questionnaireService.getQuestionnaires(), 'id');
    this.$mdDialog = $mdDialog;
    this.answerService = answerService;
    this.$state = $state;


    childService.getChild($stateParams.childId).then(child => {
      this.child = child;

      if (!this.child) {
        this.$state.go('home');
        return;
      }

      this.age = ageService.getBestAge(this.child.getAgeInDays());

      // Add a response and redirect to editing it.
      if (!$stateParams.responseId) {
        this.answerService.addResponse(this.child.id, this.age.id)
          .then(response => {
            this.$state.go('response.edit', {childId: this.child.id, responseId: response.id});
          });
        return;
      }

      return this.answerService.getResponseById($stateParams.responseId);
    }).then(response => {
      this.response = response;

      if (response) {
        this.goToNextQuestionnaire();
      }
    });

    this.result = {};
    this.invalid = {};
  }

  goToNextQuestionnaire() {
    if (!this.response) {
      throw new Error('Need to get a response before we go to the next questionnaire');
    }

    const next = this.getNextQuestionnaire();

    if (!next) {
      throw new Error('Attempted to go to the next questionnaire but there wasn\'t one');
    }

    this.currentQuestionnaireId = this.getNextQuestionnaire().id;
    this.result[this.currentQuestionnaireId] = {};
    this.invalid[this.currentQuestionnaireId] = {};
  }

  getCurrentQuestionnaireIndex() {
    if (this.response) {
      return this.getTotalQuestionnaires() - Object.keys(this.getIncompleteQuestionnaires()).length + 1;
    }
  }

  getTotalQuestionnaires() {
    return Object.keys(this.questionnaires).length;
  }

  getIncompleteQuestionnaires() {
    if (this.response) {
      return _(this.questionnaires)
        .filter((questionnaire, id) => !(this.result[id] && this.result[id].complete))
        .indexBy('id')
        .value();
    }

    return {};
  }

  getNextQuestionnaire() {
    const incompleteQuestionnairesIds = Object.keys(this.getIncompleteQuestionnaires());

    if (incompleteQuestionnairesIds.length) {
      return this.questionnaires[incompleteQuestionnairesIds[0]];
    }
  }

  getCurrentQuestionnaire() {
    return this.questionnaires[this.currentQuestionnaireId];
  }

  isLastQuestionnaire() {
    return Object.keys(this.getIncompleteQuestionnaires()).length === 1;
  }

  getHeaderTitle() {
    if (this.age && this.child) {
      return 'Testing for ' + this.child.name + '(' + this.age.label + ')';
    }
  }

  trySubmit($event) {
    $event.preventDefault();

    const currentQuestionnaire = this.getCurrentQuestionnaire();
    this.invalid = this.invalid || {};
    this.invalid[currentQuestionnaire.id] = {};
    this.noComments = this.noComments || {};
    this.noComments[currentQuestionnaire.id] = {};

    currentQuestionnaire.questions.forEach(question => {
      const result = this.result[currentQuestionnaire.id][question.id];
      const valid = result && result.answer;

      if (!valid) {
        this.invalid[currentQuestionnaire.id][question.id] = true;
        this.noComments[currentQuestionnaire.id][question.id] = true;
      } else {
        const noComments = question.comments && !this.result[currentQuestionnaire.id][question.id].comments;
        if (noComments) {
          this.noComments[currentQuestionnaire.id][question.id] = true;
        }
      }
    });

    if (!Object.keys(this.invalid[currentQuestionnaire.id]).length) {
      if (Object.keys(this.noComments[currentQuestionnaire.id]).length) {
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
    this.result[this.currentQuestionnaireId].complete = true;

    this.answerService.addAnswersToResponse(this.response.id, this.getCurrentQuestionnaire().id, this.result)
      .then(response => {
        this.response = response;

        if (Object.keys(this.getIncompleteQuestionnaires()).length) {
          this.goToNextQuestionnaire();
        } else {
          this.$state.go('result', {childId: this.child.id, responseId: this.response.id});
        }
      });
  }
}

QuestionnaireController.$inject = ['$stateParams', 'QuestionnaireService', 'AnswerService', '$state', 'ChildService', 'AgeService', '$mdDialog'];