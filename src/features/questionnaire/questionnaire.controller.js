'use strict';

import _ from 'lodash';

export default class QuestionnaireController {
  constructor($stateParams, questionnaireService, answerService, $state, childService, ageService, $mdDialog) {
    this.questionnaires = _.keyBy(questionnaireService.getQuestionnaires(), 'id');
    this.$mdDialog = $mdDialog;
    this.answerService = answerService;
    this.$state = $state;
    this.loading = true;

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
      this.loading = false;
      this.response = response;

      if (response) {
        this.goToNextQuestionnaire();
      }
    });

    this.result = {};
    this.invalid = {};
  }

  /** Moves the user to the next questionnaire by advancing currentQuestionnaireId if possible. */
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

  /** 
   * Gets the number of the questionnaire that we're up to (i.e. starts at 1 then increases to the number of
   * questionnaires available).
   */
  getCurrentQuestionnaireNumber() {
    if (this.response) {
      return this.getTotalQuestionnaires() - Object.keys(this.getIncompleteQuestionnaires()).length + 1;
    }
  }

  /**
   * Gets the total number of questionnaires that the user is going to complete.
   */
  getTotalQuestionnaires() {
    return Object.keys(this.questionnaires).length;
  }

  /**
   * Filters the list of questionnaires and returns only the ones that haven't been completed as part of this
   * response yet.
   */
  getIncompleteQuestionnaires() {
    if (this.response) {
      return _(this.questionnaires)
        .filter((questionnaire, id) => !(this.result[id] && this.result[id].complete))
        .keyBy('id')
        .value();
    }

    return {};
  }

  /** Gets the next questionnaire that is due to be completed. */
  getNextQuestionnaire() {
    const incompleteQuestionnairesIds = Object.keys(this.getIncompleteQuestionnaires());

    if (incompleteQuestionnairesIds.length) {
      return this.questionnaires[incompleteQuestionnairesIds[0]];
    }
  }

  /** Gets the questionnaire that we're currently completing. */
  getCurrentQuestionnaire() {
    return this.questionnaires[this.currentQuestionnaireId];
  }

  /** Returns true if this is the last questionnaire we'll complete for this response. */
  isLastQuestionnaire() {
    return Object.keys(this.getIncompleteQuestionnaires()).length === 1;
  }

  getHeaderTitle() {
    if (this.age && this.child) {
      return 'Testing for ' + this.child.name + '(' + this.age.label + ')';
    }
  }

  /** Validates and submits the current questionnaire answers - three possible outcomes:
   *    - All validated correctly, form submits.
   *    - Missing answers, the question is marked as invalid and submission stops.
   *    - Missing comments - a dialog is displayed asking if the user really wants to skip comments. From there
   *      the form either submits or submission halts.
   */
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

  /**
   * Launches a dialog to confirm whether the user really wants to submit with missing comments. Calls {@link #submit} if so.
   */
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

  /**
   * Submits the questions, regardless of whether they're valid, then moves to the next questionnaire upon submission success.
   */
  submit() {
    this.result[this.currentQuestionnaireId].complete = true;

    this.loading = true;
    this.answerService.addAnswersToResponse(this.response.id, this.currentQuestionnaireId, this.result[this.currentQuestionnaireId])
      .then(response => {
        this.loading = false;
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