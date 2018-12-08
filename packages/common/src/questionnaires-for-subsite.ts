import * as _ from "lodash";

import siteSpecificConfig from "./site-specific-config";
import questionnaires, { Questionnaire } from "./questionnaires";

export default function getQuestionnairesForSubsite(
  subsiteId: string
): Questionnaire[] {
  const includeQuestionnaireIds: string[] = _.get(siteSpecificConfig, [
    subsiteId,
    "questionnaires"
  ]);

  if (!includeQuestionnaireIds) {
    return questionnaires;
  } else {
    return questionnaires.filter(questionnaire =>
      _.includes(includeQuestionnaireIds, questionnaire.id)
    );
  }
}
