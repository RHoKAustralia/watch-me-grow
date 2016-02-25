'use strict';

import {combineQuestionsAndAnswers, getOverallResult} from '../../models/data.functions';

export default class ResultController {
  constructor(childService, $stateParams, questionnaireService, answerService, ageService) {
    answerService.getResultById($stateParams.childId, $stateParams.answerId).then(result => {
      childService.getChild($stateParams.childId).then(child => {
        this.child = child;
      });
      this.questionnaire = questionnaireService.getQuestionnaire(result.questionnaireId);
      this.age = ageService.getAgeById(result.ageId);
      this.questions = combineQuestionsAndAnswers(this.questionnaire.questions, result.answers);

      this.overallResult = getOverallResult(this.questionnaire, this.questions);
    });
  }

  getHeaderTitle() {
    if (this.age && this.child && this.questionnaire) {
      return 'Results of ' + this.questionnaire.title + ' at ' + this.age.label + ' for ' + this.child.name;
    }
  }

  getChildId() {
    return this.child.id;
  }

  getCompletedQuestionnaires() {
    return this.completedQuestionnaires
  }

  addChild() {
    this.$location.path('/add_child')
  }
}

ResultController.$inject = ['ChildService', '$stateParams', 'QuestionnaireService', 'AnswerService', 'AgeService'];