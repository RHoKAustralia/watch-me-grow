'use strict';

export default class QuestionnaireController {
  constructor(answerService, $state, questionnaireService) {
    this.answerService = answerService;
    this.questionnaireService = questionnaireService;
    this.$state = $state;
    this.question = undefined;
    this.answer = {};
    this.invalid = false;

    this.questionNumber = 0;
    this.questionCount = this.questionnaireService.getQuestionCount();

    this.refresh();
  }

  getHeaderTitle() {
    return 'Questionnaire';
  }

  tryAnswer($event) {
    if ($event) {
      $event.preventDefault();
    }

    const valid = this.answer && this.answer.value;

    if (!valid) {
      this.invalid = true;
    } else {
      this.invalid = false;
      this.submitAnswer();
    }
  }

  radioButtonClicked() {
    if (!this.question.comments) {
      this.tryAnswer();
    }
  }

  submitAnswer() {
    this.loading = true;

    return this.answerService.addAnswer(
      this.question.questionnaire.id,
      this.question.id,
      this.answer.value,
      this.comment
    ).then(() => {
      if (this.atLastQuestion()) {
        this.$state.go('result');
      } else {
        this.goToNext();
      }
    });
  }

  refresh() {
    this.loading = true;
    this.invalid = false;

    this.question = this.questionnaireService.getQuestionByNumber(this.questionNumber);

    this.answer = {};
    this.answerService.getAnswer(this.question.questionnaire.id, this.question.id)
      .then(answer => {
        this.answer = answer;

        this.loading = false;
      });
  }

  goToNext() {
    this.questionNumber++;

    this.refresh();
  }

  goToPrev() {
    this.questionNumber--;

    this.refresh();
  }

  canGoToNext() {
    return !!this.answer;
  }

  canGoToPrev() {
    return this.questionNumber > 0;
  }

  atLastQuestion() {
    return this.questionNumber >= this.questionCount - 1;
  }
}

QuestionnaireController.$inject = ['AnswerService', '$state', 'QuestionnaireService'];