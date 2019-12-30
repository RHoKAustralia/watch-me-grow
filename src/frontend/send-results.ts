import moment from "moment";
import i18next from "i18next";

import {
  NotifyFunctionInput,
  NotifyFunctionInputDetails
} from "src/common/notify-function-input";

import { Details } from "./components/stores/details-store";
import { Results } from "./components/stores/results-store";
import { Consent } from "src/common/notify-function-input";
import { HostConfig } from "src/common/site-specific-config";
import { DB_DATE_FORMAT } from "src/common/constants";

export default function sendResults(
  details: Details,
  results: Results,
  consent: Consent,
  subsite: HostConfig
) {
  const ageInMonths = moment().diff(details.babyDob, "months");

  function sendWithLanguage() {
    const metadata: NotifyFunctionInputDetails = {
      recipientEmail: details.parentEmail,
      testDate: moment().toISOString(),
      nameOfParent: details.parentName,
      firstNameOfChild: details.babyFirstName,
      lastNameOfChild: details.babyLastName,
      genderOfChild: details.babyGender,
      dobOfChild: moment(details.babyDob!).format(DB_DATE_FORMAT),
      doctorEmail: details.doctorEmail,
      siteId: subsite!.id,
      language: i18next.language
    };

    const data: NotifyFunctionInput = {
      details: metadata,
      results,
      consent
    };

    fetch("/api/result", {
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
