'use strict';

import questions from '../../data/questionaires';
import ages from '../../data/ages';

export default class HomeController {
  constructor(answerService) {
    this.answerService = answerService
  }

  getQuestionnaires() {
    return questions;
  }

  getAnsweredQuestionaires() {
    var that = this
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

HomeController.$inject = ['AnswerService'];