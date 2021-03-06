import moment from "moment";

import strings from "../common/strings";
import questionnaires from "wmg-common/questionnaires";
import { combineQuestionsAndAnswers } from "wmg-common/data-functions";

export default function sendResults(details, results) {
  const ageInMonths = moment().diff(details.babyDob, "months");

  const metadata = {
    recipient_email: details.parentEmail,
    test_date: moment().toISOString,
    name_of_parent: details.parentName,
    first_name_of_child: details.babyFirstName,
    last_name_of_child: details.babyLastName,
    gender_of_child: details.babyGender,
    dob_child: details.babyDob.toISOString(),
    doctor_email: details.doctorEmail,
    age_of_child:
      ageInMonths < 24
        ? ageInMonths + " months"
        : Math.floor(ageInMonths / 12) + " years",
    age_in_months: ageInMonths,
    results_text: getResultText(results),
    subsite: process.env.SUBSITE || "australia",
    location: details.location
  };

  const data = {
    details: metadata,
    results
  };

  fetch(
    "https://x1q7y0yp5k.execute-api.ap-southeast-2.amazonaws.com/prod/subscribe",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  );
}

function getResultText(results) {
  const concernsStringObj = results.concern
    ? strings.result.concerns
    : strings.result.noConcerns;
  return concernsStringObj.title + " " + concernsStringObj.subtitle;
}

function generateQuestionnaireResults(results) {
  return questionnaires.reduce((acc, { id, questions }) => {
    acc[`${id}_answers`] = combineQuestionsAndAnswers(
      questions,
      results.getResultsForQuestionnaire(id)
    ).reduce((acc, question) => {
      acc[question.metadata.id] = { answer: question.answer.metadata.text };
      return acc;
    }, {});
    return acc;
  }, {});
}
