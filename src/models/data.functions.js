"use strict";

export function combineQuestionsAndAnswers(questions, answers) {
  return questions.map(question => {
    const rawAnswer = answers[question.id];

    return {
      metadata: question,
      answer: Object.assign(rawAnswer, {
        metadata: question.answers.find(answerMetadata => answerMetadata.value === rawAnswer.answer)
      })
    };
  });
};

export function getOverallResult(questionnaire, combinedQuestions) {
  var redFlagScore = 0;
  var amberFlagScore = 0;

  if (questionnaire.analysis.strategy === "simple") {
    combinedQuestions.forEach(function (question) {
      if (question.answer.metadata.redFlagQuestion) {
        redFlagScore++
      }
      if (question.answer.metadata.amberFlagQuestion) {
        amberFlagScore++
      }
    });

    if (redFlagScore >= questionnaire.analysis.redFlagThreshold) {
      return "RED_FLAG"
    } else if (redFlagScore >= questionnaire.analysis.amberFlagThreshold) {
      return "AMBER_FLAG"
    } else {
      return "NO_FLAG"
    }
  }
};
