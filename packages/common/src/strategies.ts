import { Questionnaire } from "./questionnaires";
import { StrategyId } from "./strategy-id";

const strategies: {
  [strategyId in StrategyId]: (
    redFlagScore: number,
    questionnaire: Questionnaire
  ) => boolean
} = {
  simple: (redFlagScore, questionnaire) => {
    return redFlagScore >= questionnaire.analysis.redFlagThreshold;
  },
  cdc: (redFlagScore, questionnaire) => {
    return redFlagScore >= 1;
  }
};

export default strategies;
