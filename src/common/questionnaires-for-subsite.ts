import { getConfigById } from "./site-specific-config";
import questionnaires, { Questionnaire } from "./questionnaires";

export default function getQuestionnairesForSubsite(
  subsiteId: string
): Questionnaire[] {
  const siteQuestionnaireIds = getConfigById(subsiteId).questionnaires;

  return questionnaires.filter(
    questionnaire => siteQuestionnaireIds.indexOf(questionnaire.id) >= 0
  );
}
