import moment from "moment";

import {
  NotifyFunctionInput,
  NotifyFunctionInputDetails
} from "@wmg/common/lib/notify-function-input";

import strings from "@wmg/common/lib/strings";
import questionnaires from "@wmg/common/lib/questionnaires";
import { combineQuestionsAndAnswers } from "@wmg/common/lib/data-functions";
import subsite from "./util/subsite";
import { Details } from "./components/stores/details-store";
import { Results } from "./components/stores/results-store";

export default function sendResults(details: Details, results: Results) {
  const ageInMonths = moment().diff(details.babyDob, "months");

  const metadata: NotifyFunctionInputDetails = {
    recipientEmail: details.parentEmail,
    testDate: moment().toISOString(),
    nameOfParent: details.parentName,
    firstNameOfChild: details.babyFirstName,
    lastNameOfChild: details.babyLastName,
    genderOfChild: details.babyGender,
    dobOfChild: details.babyDob!.toISOString(),
    doctorEmail: details.doctorEmail,
    ageInMonths: ageInMonths,
    siteId: subsite!.id
  };

  const data: NotifyFunctionInput = {
    details: metadata,
    results
  };

  fetch("/api/notifyEmail", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
}
