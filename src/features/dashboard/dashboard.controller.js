'use strict';

import questions from '../../data/questionnaires';
import ages from '../../data/ages';
import _ from 'lodash';

export default class DashboardController {
  constructor(answerService, $stateParams, childService, questionnaireService, ageService) {
    this.answerService = answerService;
    this.child = childService.getChild($stateParams.childId);
    this.questionnaireService = questionnaireService;

    const childAnswers = this.answerService.getAnswersForChild(this.child.id) || {};

    this.completed =
      Object.keys(childAnswers)
        .map(key => childAnswers[key])
        .map(questionnaireAnswers => ({
          answers: questionnaireAnswers,
          questionnaire: this.questionnaireService.getQuestionnaire(questionnaireAnswers.questionnaireId),
          age: ageService.getAgeById(questionnaireAnswers.ageId)
        }));

    this.toDos = this.questionnaireService.getQuestionnaires();
  }

  getHeaderTitle() {
    return 'Dashboard for ' + this.child.name;
  }
}

DashboardController.$inject = ['AnswerService', '$stateParams', 'ChildService', 'QuestionnaireService', 'AgeService'];