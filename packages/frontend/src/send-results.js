import moment from "moment";

import strings from "@wmg/common/src/strings";
import questionnaires from "@wmg/common/src/questionnaires";
import { combineQuestionsAndAnswers } from "@wmg/common/src/data-functions";

export default function sendResults(details, results) {
  const ageInMonths = moment().diff(details.babyDob, "months");

  const metadata = {
    recipientEmail: details.parentEmail,
    testDate: moment().toISOString(),
    nameOfParent: details.parentName,
    firstNameOfChild: details.babyFirstName,
    lastNameOfChild: details.babyLastName,
    genderOfChild: details.babyGender,
    dobOfChild: details.babyDob.toISOString(),
    doctorEmail: details.doctorEmail,
    ageOfChild:
      ageInMonths < 24
        ? ageInMonths + " months"
        : Math.floor(ageInMonths / 12) + " years",
    ageInMonths: ageInMonths,
    resultsText: getResultText(results),
    subsite: process.env.SUBSITE || "australia",
    location: details.location
  };

  const data = {
    details: metadata,
    results
  };

  fetch(
    // "https://x1q7y0yp5k.execute-api.ap-southeast-2.amazonaws.com/prod/subscribe",
    "http://localhost:5000/watchmegrow-dev-afe2d/us-central1/notifyEmail",
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
