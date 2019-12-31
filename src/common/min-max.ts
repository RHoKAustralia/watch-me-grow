import _ from "lodash";
import { Questionnaire } from "./questionnaires";

export default function getMinMax(questionnairesRaw: Questionnaire[]) {
  if (questionnairesRaw.length === 0) {
    throw new Error("No questionnaires to get minmax for");
  }

  const questionnaires = _(questionnairesRaw);

  const minMonths: number = questionnaires
    .map(questionnaire => questionnaire.ageGroups.min)
    .sortBy(x => x)
    .head() as number;
  const maxMonths: number = questionnaires
    .map(questionnaire => questionnaire.ageGroups.max)
    .sortBy(x => -x)
    .head() as number;

  return { minMonths: minMonths, maxMonths: maxMonths };
}
