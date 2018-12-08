import questionnaires, {
  Questionnaire,
  Question,
  Answer
} from "./questionnaires";
import strategies from "./strategies";
import { RecordedAnswer } from "./notify-function-input";

export type QuestionAndAnswer = {
  metadata: Question;
  answer: {
    rawAnswer: RecordedAnswer;
    metadata: Answer;
  };
};

export type CombinedResult = {
  questionnaire: Questionnaire;
  results: QuestionAndAnswer[];
};

export function mark(combinedResults: CombinedResult[]): boolean {
  return combinedResults
    .map(combined => getOverallResult(combined.questionnaire, combined.results))
    .reduce((soFar, current) => soFar || current);
}

export function combineAll(results: {
  [questionnaireId: string]: {
    [id: string]: RecordedAnswer;
  };
}): CombinedResult[] {
  return questionnaires
    .filter(questionnaire => !!results[questionnaire.id])
    .map(questionnaire => {
      return {
        questionnaire,
        results: combineQuestionsAndAnswers(
          questionnaire.questions,
          results[questionnaire.id]
        )
      };
    });
}

/**
 * Combines an array of questions and a map of question ids to answers into an array of combined objects.
 */
export function combineQuestionsAndAnswers(
  questions: Question[],
  answers: { [questionId: string]: RecordedAnswer }
): QuestionAndAnswer[] {
  return questions.map(question => {
    const rawAnswer = answers[question.id];
    const metadata = question.answers.find(
      answerMetadata => answerMetadata.value === rawAnswer.value
    );

    if (!metadata) {
      throw new Error(
        `Could not find answer for question id ${question.id} and answer ${
          rawAnswer.value
        }`
      );
    }

    return {
      metadata: question,
      answer: {
        rawAnswer,
        metadata
      }
    };
  });
}

/**
 * Scores the result of a questionnaire based on its analysis strategy and an array of combined questions and answers
 * as returned from {@link #combineQuestionsAndAnswers}.
 */
export function getOverallResult(
  questionnaire: Questionnaire,
  combinedQuestions: QuestionAndAnswer[]
): boolean {
  const score = combinedQuestions.reduce(
    (soFar, questionAndAnswer) =>
      soFar + questionAndAnswer.answer.metadata.redFlagScore,
    0
  );

  const result = strategies[questionnaire.analysis.strategy](
    score,
    questionnaire
  );

  return result;
}
