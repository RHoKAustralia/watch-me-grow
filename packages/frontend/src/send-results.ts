import moment from "moment";

import strings from "@wmg/common/lib/strings";
import questionnaires from "@wmg/common/lib/questionnaires";
import { combineQuestionsAndAnswers } from "@wmg/common/lib/data-functions";
import subsite from "./util/subsite";
import { Details } from "./components/stores/details-store";
import { Results } from "./components/stores/results-store";

function getFunctionUrl(): string {
  if (subsite.host === "localhost") {
    return "http://localhost:5000/watchmegrow-dev-afe2d/us-central1/notifyEmail";
  } else if (subsite.dev) {
    // FIXME
    return "";
  } else {
    // FIXME
    return "";
  }
}

export default function sendResults(details: Details, results: Results) {
  const ageInMonths = moment().diff(details.babyDob, "months");

  const metadata = {
    recipientEmail: details.parentEmail,
    testDate: moment().toISOString(),
    nameOfParent: details.parentName,
    firstNameOfChild: details.babyFirstName,
    lastNameOfChild: details.babyLastName,
    genderOfChild: details.babyGender,
    dobOfChild: details.babyDob!.toISOString(),
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
    getFunctionUrl()
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

function getResultText(results: Results) {
  const concernsStringObj = results.concern
    ? strings.result.concerns
    : strings.result.noConcerns;
  return concernsStringObj.title + " " + concernsStringObj.subtitle;
}

function generateQuestionnaireResults(results: Results) {
  return questionnaires.reduce(
    (acc, { id, questions }) => {
      acc[`${id}_answers`] = combineQuestionsAndAnswers(
        questions,
        results.getResultsForQuestionnaire(id)
      ).reduce((acc: any, question: any) => {
        acc[question.metadata.id] = { answer: question.answer.metadata.text };
        return acc;
      }, {});
      return acc;
    },
    {} as any
  );
}
