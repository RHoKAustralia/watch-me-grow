import * as _ from "lodash";

export default function getMinMax(questionnairesRaw) {
  const questionnaires = _(questionnairesRaw);

  const minMonths = questionnaires
    .map(questionnaire => questionnaire.age_groups.min)
    .sortBy(x => x)
    .head();
  const maxMonths = questionnaires
    .map(questionnaire => questionnaire.age_groups.max)
    .sortBy(x => x)
    .last();

  return { minMonths: minMonths, maxMonths: maxMonths };
}
