'use strict';

import questions from '../../data/questionnaires';
import ages from '../../data/ages';

export default class HomeController {
  constructor(answerService, $stateParams, childService, questionnaireService) {
    this.answerService = answerService;
    this.child = childService.getChild($stateParams.childId);
    this.questionnaireService = questionnaireService;

    this.completedAges = ages
        .filter(function(age){
          return this.questionnaireService.getQuestionnaires()
              .some(function(questionaire) {
                var answers = this.answerService.getAnswers(this.child.id, age.id, questionaire.id);
                return answers != null
              }, this)
        }, this)
  }

  getQuestionnaires() {
    return this.questionnaireService.getQuestionnaires().map(questionnaire => {
      return _.extend(questionnaire, {
        age: this.questionnaireService.getBestAge(this.child.getAgeInDays(), questionnaire.id)
      });
    });
  }
}

HomeController.$inject = ['AnswerService', '$stateParams', 'ChildService', 'QuestionnaireService'];