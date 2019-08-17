import moment from "moment";
import i18next from "i18next";

import {
  NotifyFunctionInput,
  NotifyFunctionInputDetails
} from "@wmg/common/lib/notify-function-input";

import questionnaires from "@wmg/common/lib/questionnaires";
import { combineQuestionsAndAnswers } from "@wmg/common/lib/data-functions";
import subsite from "./util/subsite";
import { Details } from "./components/stores/details-store";
import { Results } from "./components/stores/results-store";

export default function sendResults(details: Details, results: Results) {
  const ageInMonths = moment().diff(details.babyDob, "months");

  function sendWithLanguage() {
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
      siteId: subsite!.id,
      language: i18next.language
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

  if (i18next.language) {
    sendWithLanguage();
  } else {
    const handler = () => {
      sendWithLanguage();
      i18next.off("languageChanged", handler);
    };
    i18next.on("languageChanged", handler);
  }
}
