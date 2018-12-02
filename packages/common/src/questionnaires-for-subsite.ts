import siteSpecificConfig from "./site-specific-config";
import * as _ from "lodash";
import questionnaires from "./questionnaires";

export default function getQuestionnairesForSubsite(subsiteId: string) {
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
