import questionnairesForSubsite from "./questionnaires-for-subsite";
import { Question, Questionnaire } from "./questionnaires";
import { HostConfig } from "@wmg/common/src/site-specific-config";

export type QuestionLookup = {
  [index: number]: { question: Question; questionnaire: Questionnaire };
};

export default function getQuestions(
  months: number,
  subsite: HostConfig
): QuestionLookup {
  return questionnairesForSubsite(subsite.host)
    .filter(questionnaire => {
      const ageGroups = questionnaire.age_groups;

      return months >= ageGroups.min && months <= ageGroups.max;
    })
    .map(questionnaire => {
      return questionnaire.questions.map(question => {
        return { questionnaire, question };
      });
    })
    .reduce((soFar, questions) => soFar.concat(questions))
    .reduce(
      (soFar, question, i) => {
        soFar[i + 1] = question;
        return soFar;
      },
      {} as QuestionLookup
    );
}
