import { QuestionAndAnswer } from "./data-functions";
import { StrategyId } from "./strategy-id";
import { Questionnaire } from "./questionnaires";
import groupBy from "lodash/groupBy";

// const score = combinedQuestions.reduce(
//   (soFar, questionAndAnswer) =>
//     soFar + questionAndAnswer.answer.metadata.redFlagScore,
//   0
// );

function scoreStandard(questionAndAnswers: QuestionAndAnswer[]) {
  return questionAndAnswers.reduce(
    (soFar, questionAndAnswer) =>
      soFar + questionAndAnswer.answer.metadata.redFlagScore,
    0
  );
}

const strategies: {
  [strategyId in StrategyId]: (
    questionnaire: Questionnaire,
    answers: QuestionAndAnswer[]
  ) => boolean;
} = {
  simple: (questionnaire, answers) => {
    return scoreStandard(answers) >= questionnaire.analysis.redFlagThreshold;
  },
  cdc: (questionnaire, answers) => {
    return scoreStandard(answers) >= 1;
  },
  bpsc: (questionnaire, answers) => {
    const grouped = groupBy(answers, answer => answer.question.scoreGroup);

    const scores = Object.keys(grouped).map(group =>
      scoreStandard(grouped[group])
    );

    return scores.some(
      score => score >= questionnaire.analysis.redFlagThreshold
    );
  }
};

export default strategies;
