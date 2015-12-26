'use strict';

export default class ResultController {
  constructor(childService, $stateParams, questionnaireService, answerService, ageService) {
    this.childService = childService;
    this.age = ageService.getAgeById($stateParams.ageId);
    this.child = childService.getChild($stateParams.childId);

    const questionnaireAges = questionnaireService.getQuestionnaires()
      .map(questionnaire => [questionnaire, ageService.getBestAge(this.age.days, questionnaire)])
      .filter(([questionnaire, age]) => !!age);

    this.completedQuestionnaires = questionnaireAges
      .map(([questionnaire, age]) => [questionnaire, age, answerService.getAnswers(this.child.id, age.id, questionnaire.id)])
      .filter(([questionnaire, age, answers]) => !!answers)
      .map(([questionnaire, age, answers]) => ({
        metadata: questionnaire,
        age: age,
        questions: questionnaire.questions.map(question => {
          const rawAnswer = answers[question.id];

          return {
            metadata: question,
            answer: Object.assign(rawAnswer, {
              metadata: question.answers.find(answerMetadata => answerMetadata.value === rawAnswer.answer)
            })
          };
        })
      }))
      .map(questionnaire => Object.assign(questionnaire, {
        result: this.getOverallResult(questionnaire)
      }));

    this.uncompletedQuestionnaires = questionnaireAges
      .filter(([questionnaire, age]) => !answerService.getAnswers(this.child.id, age.id, questionnaire.id))
      .map(([questionnaire, age]) => ({
        metadata: questionnaire,
        age: age,
        result: 'INCOMPLETE'
      }));

    this.allQuestionnaires = this.completedQuestionnaires.concat(this.uncompletedQuestionnaires);
  }

  getHeaderTitle() {
    if (this.age && this.child) {
      return 'Results: ' + this.age.label + ' for ' + this.child.name;
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

  getOverallResult(questionnaire) {
    var redFlagScore = 0;
    var amberFlagScore = 0;

    if (questionnaire.metadata.analysis.strategy === "simple") {
      questionnaire.questions.forEach(function (question) {
        if (question.answer.metadata.redFlagQuestion) {
          redFlagScore++
        }
        if (question.answer.metadata.amberFlagQuestion) {
          amberFlagScore++
        }
      });

      if (redFlagScore >= questionnaire.metadata.analysis.redFlagThreshold) {
        return "RED_FLAG"
      } else if (redFlagScore >= questionnaire.metadata.analysis.amberFlagThreshold) {
        return "AMBER_FLAG"
      } else {
        return "NO_FLAG"
      }
    }
  }
}

ResultController.$inject = ['ChildService', '$stateParams', 'QuestionnaireService', 'AnswerService', 'AgeService'];