'use strict';

import moment from 'moment';
import {combineQuestionsAndAnswers, getOverallResult} from '../../models/data.functions';

export default class ResultController {
  constructor(childService, $stateParams, questionnaireService, answerService, ageService) {
    this.responseId = $stateParams.responseId;
    this.questionnaireService = questionnaireService;
    this.answerService = answerService;
    this.ageService = ageService;

    childService.getChild($stateParams.childId).then(child => {
      this.child = child;
    });

    this.questionnairesPromise = this.answerService.getResponseById(this.responseId).then(result => {
      this.questionnaires = _(result.questionnaires)
        .map((answers, questionnaireId) => {
          const questionnaire = this.questionnaireService.getQuestionnaire(questionnaireId);
          const combinedQuestions = combineQuestionsAndAnswers(questionnaire.questions, answers);
          return {
            metadata: questionnaire,
            questions: combinedQuestions,
            result: getOverallResult(questionnaire, combinedQuestions)
          }
        })
        .value();

      this.date = moment(result.lastModified);
      this.age = this.ageService.getAgeById(result.ageId);
    });
  }

  getQuestionnaires() {
    return this.questionnaires;
  }

  getHeaderTitle() {
    if (this.child && this.date) {
      return `Results for ${this.child.name} at ${this.date.format('LL')}`;
    }
  }

  getChildId() {
    return this.child && this.child.id;
  }

  getCompletedQuestionnaires() {
    return this.completedQuestionnaires
  }

  addChild() {
    this.$location.path('/add_child')
  }
}

ResultController.$inject = ['ChildService', '$stateParams', 'QuestionnaireService', 'AnswerService', 'AgeService'];