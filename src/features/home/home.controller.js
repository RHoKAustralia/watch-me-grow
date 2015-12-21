'use strict';

import questions from '../../data/questionnaires';
import ages from '../../data/ages';
import _ from 'lodash';

export default class HomeController {
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
  }

  getQuestionnaires() {
    return this.questionnaireService.getQuestionnaires();
  }

  getHeaderTitle() {
    return 'Dashboard: ' + this.child.name;
  }
}

HomeController.$inject = ['AnswerService', '$stateParams', 'ChildService', 'QuestionnaireService'];