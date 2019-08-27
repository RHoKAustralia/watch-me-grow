import questionnaires, {
  Questionnaire,
  Question,
  Answer
} from "./questionnaires";
import strategies from "./strategies";
import { RecordedAnswer } from "./notify-function-input";
import i18next from "i18next";
import groupBy from "lodash/groupBy";
import mapValues from "lodash/mapValues";

export type QuestionAndAnswer = {
  metadata: Question;
  questionText: string;
  answer: {
    rawAnswer: RecordedAnswer;
    metadata: Answer;
    answerText: string;
    concern: boolean;
  };
};

export type CombinedResult = {
  questionnaire: Questionnaire;
  results: QuestionAndAnswer[];
};

export type Concerns = { [category: string]: boolean };

export function anyConcerns(concerns: Concerns): boolean {
  return Object.keys(concerns).some(key => concerns![key]);
}

export function mark(combinedResults: CombinedResult[]): Concerns {
  const grouped = groupBy(
    combinedResults,
    (result: CombinedResult) => result.questionnaire.category
  );
  return mapValues(grouped, markGroup);
}

export function markGroup(combinedResults: CombinedResult[]): boolean {
  return combinedResults
    .map(combined => getOverallResult(combined.questionnaire, combined.results))
    .reduce((soFar, current) => soFar || current);
}

export function combineAll(
  results: {
    [questionnaireId: string]: {
      [id: string]: RecordedAnswer;
    };
  },
  t: i18next.TFunction
): CombinedResult[] {
  return questionnaires
    .filter(questionnaire => !!results[questionnaire.id])
    .map(questionnaire => {
      return {
        questionnaire,
        results: combineQuestionsAndAnswers(
          questionnaire.questions,
          results[questionnaire.id],
          t
        )
      };
    });
}

/**
 * Combines an array of questions and a map of question ids to answers into an array of combined objects.
 */
export function combineQuestionsAndAnswers(
  questions: Question[],
  answers: { [questionId: string]: RecordedAnswer },
  t: i18next.TFunction
): QuestionAndAnswer[] {
  return questions.map(question => {
    const rawAnswer = answers[question.id];
    const metadata = question.answers.find(
      answerMetadata => answerMetadata.value === rawAnswer.value
    );

    if (!metadata) {
      throw new Error(
        `Could not find answer for question id ${question.id} and answer ${rawAnswer.value}`
      );
    }

    return {
      metadata: question,
      questionText: t(question.textId),
      answer: {
        rawAnswer,
        metadata,
        answerText: t(metadata.textId),
        concern: metadata.redFlagScore > 0
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
  const result = strategies[questionnaire.analysis.strategy](
    questionnaire,
    combinedQuestions
  );

  return result;
}
