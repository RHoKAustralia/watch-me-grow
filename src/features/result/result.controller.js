'use strict';

import moment from 'moment';
import {combineQuestionsAndAnswers, getOverallResult} from '../../models/data.functions';

export default class ResultController {
  constructor(questionnaireService, answerService, $q) {
    this.questionnaireService = questionnaireService;
    this.answerService = answerService;

    this.concerns = this.questionnaireService.getQuestionnaires()
      .map(questionnaire => {
        const fullAnswers = this.answerService.getQuestionnaireAnswers(questionnaire.id);
        const combinedQuestions = combineQuestionsAndAnswers(questionnaire.questions, fullAnswers);

        return getOverallResult(questionnaire, combinedQuestions);
      })
      .some(flag => flag !== 'NO_FLAG');
  }

  static getHeaderTitle() {
    return 'Result';
  }
}

ResultController.$inject = ['QuestionnaireService', 'AnswerService', '$q'];