'use strict';

export default class ResultController {
  constructor(childService, $stateParams, questionnaireService, answerService, ageService) {
    const result = answerService.getResultById($stateParams.childId, $stateParams.answerId);

    this.child = childService.getChild($stateParams.childId);
    this.questionnaire = questionnaireService.getQuestionnaire(result.questionnaireId);
    this.age = ageService.getAgeById(result.ageId);

    this.questions = this.questionnaire.questions.map(question => {
      const rawAnswer = result.answers[question.id];

      return {
        metadata: question,
        answer: Object.assign(rawAnswer, {
          metadata: question.result.find(answerMetadata => answerMetadata.value === rawAnswer.answer)
        })
      };
    });

    this.overallResult = this.getOverallResult();
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

  getOverallResult() {
    var redFlagScore = 0;
    var amberFlagScore = 0;

    if (this.questionnaire.analysis.strategy === "simple") {
      this.questions.forEach(question => {
        if (question.answer.metadata.redFlagQuestion) {
          redFlagScore++
        }
        if (question.answer.metadata.amberFlagQuestion) {
          amberFlagScore++
        }
      });

      if (redFlagScore >= this.questionnaire.analysis.redFlagThreshold) {
        return "RED_FLAG"
      } else if (redFlagScore >= this.questionnaire.analysis.amberFlagThreshold) {
        return "AMBER_FLAG"
      } else {
        return "NO_FLAG"
      }
    }
  }
}

ResultController.$inject = ['ChildService', '$stateParams', 'QuestionnaireService', 'AnswerService', 'AgeService'];