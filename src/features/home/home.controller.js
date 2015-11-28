'use strict';

import questions from '../../data/questionnaires';
import ages from '../../data/ages';

export default class HomeController {
  constructor(answerService, $stateParams, childService, questionnaireService) {
    this.answerService = answerService;
    this.child = childService.getChild($stateParams.childId);
    this.questionnaireService = questionnaireService;
  }

  getQuestionnaires() {
    return this.questionnaireService.getQuestionnaires().map(questionnaire => {
      return _.extend(questionnaire, {
        age: this.questionnaireService.getBestAge(this.child.getAgeInDays(), questionnaire.id)
      });
    });
  }

  getAnsweredQuestionaires() {
    var that = this;
    return ages
      .map(function(age){
        return questions
          .map(function(questionaire) {
            var answers = that.answerService.getAnswers(age.id, questionaire.id);
            if(answers !== null) {
              return {
                age: age,
                questionaire: questionaire,
                answer: answers
              }
            }
          })
          .filter(function(x) { return x != null})
      })
    .reduce(function(a, b) { //flaten
          return a.concat(b);
    }, []);
  }
}

HomeController.$inject = ['AnswerService', '$stateParams', 'ChildService', 'QuestionnaireService'];