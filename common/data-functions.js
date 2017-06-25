const questionnaires = require("./questionnaires");

exports.mark = function(combinedResults) {
  return combinedResults
    .map(combined =>
      exports.getOverallResult(combined.questionnaire, combined.results)
    )
    .some(flag => flag === "RED_FLAG" || flag === "AMBER_FLAG");
};

exports.combineAll = function(results) {
  return questionnaires
    .filter(questionnaire => !!results[questionnaire.id])
    .map(questionnaire => {
      return {
        questionnaire,
        results: exports.combineQuestionsAndAnswers(
          questionnaire.questions,
          results[questionnaire.id]
        )
      };
    });
};

/**
 * Combines an array of questions and a map of question ids to answers into an array of combined objects. The
 * combined objects puts the question under "metadata" and the answer under "answer", with the metadata of the
 * answer (i.e. the actual question text) under "answer.metadata".
 *
 */
exports.combineQuestionsAndAnswers = function(questions, answers) {
  return questions.map(question => {
    const rawAnswer = answers[question.id];

    return {
      metadata: question,
      answer: Object.assign({}, rawAnswer, {
        metadata: question.answers.find(
          answerMetadata => answerMetadata.value === rawAnswer.value
        )
      })
    };
  });
};

const strategies = {
  simple: (redFlagScore, amberFlagScore, questionnaire) => {
    if (redFlagScore >= questionnaire.analysis.redFlagThreshold) {
      return "RED_FLAG";
    } else if (redFlagScore >= questionnaire.analysis.amberFlagThreshold) {
      return "AMBER_FLAG";
    } else {
      return "NO_FLAG";
    }
  },
  cdc: (redFlagScore, amberFlagScore, questionnaire) => {
    if (redFlagScore >= 1 || amberFlagScore >= 2) {
      return "RED_FLAG";
    } else if (amberFlagScore >= 1) {
      return "AMBER_FLAG";
    } else {
      return "NO_FLAG";
    }
  }
};

/**
 * Scores the result of a questionnaire based on its analysis strategy and an array of combined questions and answers
 * as returned from {@link #combineQuestionsAndAnswers}.
 */
exports.getOverallResult = function(questionnaire, combinedQuestions) {
  var redFlagScore = 0;
  var amberFlagScore = 0;

  combinedQuestions.forEach(function(question) {
    if (question.answer.metadata.redFlagQuestion) {
      redFlagScore++;
    }
    if (question.answer.metadata.amberFlagQuestion) {
      amberFlagScore++;
    }
  });

  const result = strategies[questionnaire.analysis.strategy](
    redFlagScore,
    amberFlagScore,
    questionnaire
  );

  console.log(result);

  return result;
};
