
/**
 * Combines an array of questions and a map of question ids to answers into an array of combined objects. The
 * combined objects puts the question under "metadata" and the answer under "answer", with the metadata of the
 * answer (i.e. the actual question text) under "answer.metadata".
 *
 */
export function combineQuestionsAndAnswers(questions, answers) {
    return questions.map(question => {
        const rawAnswer = answers[question.id];

        return {
            metadata: question,
            answer: Object.assign(rawAnswer, {
                metadata: question.answers.find(answerMetadata => answerMetadata.value === rawAnswer.value)
            })
        };
    });
};

/**
 * Scores the result of a questionnaire based on its analysis strategy and an array of combined questions and answers
 * as returned from {@link #combineQuestionsAndAnswers}.
 */
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