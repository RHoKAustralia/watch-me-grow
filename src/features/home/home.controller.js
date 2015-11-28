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
            var answers = that.answerService.getAnswers(age, questionaire);
            if(answers !== undefined) {
              return {
                age: age,
                questionaire: questionaire,
                answer: answers
              }
            }
          })
          .filter(function(x) { return x != undefined})
      })
    .reduce(function(a, b) { //flaten
          return a.concat(b);
    }, []);
  }

  getStatus(questionaire) {
    if (questionaire.id == "6months") {
      return "not_applicable"
    } else if (questionaire.id == "12months") {
      return "answered"
    } else if (questionaire.id == "18months") {
      return "not_answered"
    }
  }
}

HomeController.$inject = ['AnswerService'];