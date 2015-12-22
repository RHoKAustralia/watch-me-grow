'use strict';

import questions from '../../data/questionnaires';
import ages from '../../data/ages';
import _ from 'lodash';

export default class DashboardController {
  constructor(answerService, $stateParams, childService, questionnaireService) {
    this.answerService = answerService;
    this.child = childService.getChild($stateParams.childId);
    this.questionnaireService = questionnaireService;

    this.completedAges = _(ages)
      .map(age => {
        return this.questionnaireService.getQuestionnaires().map(questionnaire => [questionnaire, age])
      })
      .flatten()
      .filter(([questionnaire, age]) => {
        return !!this.answerService.getAnswers(this.child.id, age.id, questionnaire.id);
      })
      .map(([questionnaire, age]) => age)
      .value();

    this.toDos = this.questionnaireService.getQuestionnaires()
      .map(questionnaire => [questionnaire, this.questionnaireService.getBestAge(this.child.getAgeInDays(), questionnaire.id)])
      .filter(([questionnaire, age]) => !this.answerService.getAnswers(this.child.id, age.id, questionnaire.id))
      .map(([questionnaire, age]) => ({questionnaire, age}));
  }

  getHeaderTitle() {
    return 'Dashboard for ' + this.child.name;
  }
}

DashboardController.$inject = ['AnswerService', '$stateParams', 'ChildService', 'QuestionnaireService'];