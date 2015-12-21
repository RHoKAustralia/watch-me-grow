'use strict';

export default class ResultController {
  constructor(childService, $stateParams, questionnaireService, answerService, ageService) {
    this.childService = childService;
    this.age = ageService.getAgeById($stateParams.ageId);
    this.child = childService.getChild($stateParams.childId);

    this.completedQuestionaires = [];
    var that = this;
    questionnaireService
      .getQuestionnaires()
      .forEach(function(questionaire) {
        var answers = answerService.getAnswers(that.child.id, that.age.id, questionaire.id);
        if (answers != null) {
          that.completedQuestionaires.push({
            answers: answers,
            questionaire: questionaire,
            age: that.age
          })
        }
      });
  }

  getHeaderTitle() {
    if (this.age && this.child) {
      return 'Results: ' + this.age.label + ' for ' + this.child.name;
    }
  }

  getCompletedQuestionaires() {
    return this.completedQuestionaires
  }

  getAnswer(question, answers) {
    var answervalue = answers[question.id];
    return question.answers
        .find(function(a) {return a.value == answervalue})
  }

  getQuestionResult(question, answers) {
    var answer = this.getAnswer(question, answers);

    if(answer.redFlagQuestion) {
      return "RED_FLAG"
    }
    if(answer.amberFlagQuestion) {
      return "AMBER_FLAG"
    }
    return "NO_FLAG"
  }

  addChild() {
    this.$location.path('/add_child')
  }

  getOverallResult(questionaire, answers) {
    var redFlagScore = 0;
    var amberFlagScore = 0;

    var that = this;
    if(questionaire.analysis.strategy == "simple") {
      questionaire.questions.forEach(function(question) {
        var answer = that.getAnswer(question, answers)
        if(answer.redFlagQuestion) {
          redFlagScore++
        }
        if(answer.amberFlagQuestion) {
          amberFlagScore++
        }
      });

      if(redFlagScore >= questionaire.analysis.redFlagThreshold) {
        return "RED_FLAG"
      } else if(redFlagScore >= questionaire.analysis.amberFlagThreshold) {
        return "AMBER_FLAG"
      } else {
        return "NO_FLAG"
      }
    }
  }
}

ResultController.$inject = ['ChildService', '$stateParams', 'QuestionnaireService', 'AnswerService', 'AgesService'];