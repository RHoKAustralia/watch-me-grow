import moment from "moment";
const mailgunJs = require("mailgun-js");
import * as fs from "fs";
import * as _ from "lodash";
import * as markupJs from "markup-js";
import express from "express";
import * as bodyParser from "body-parser";
import * as functions from "firebase-functions";
import * as firebase from "firebase-admin";
import cors from "cors";

import questionnairesForSubsite from "@wmg/common/lib/questionnaires-for-subsite";
import {
  mark,
  combineAll,
  CombinedResult
} from "@wmg/common/lib/data-functions";
import strings, { EmailString } from "@wmg/common/lib/strings";
import minMax from "@wmg/common/lib/min-max";
import {
  NotifyFunctionInput,
  NotifyFunctionInputDetails
} from "@wmg/common/lib/notify-function-input";
import {
  getConfigById,
  HostConfig
} from "@wmg/common/lib/site-specific-config";
import ageInMonthsToString from "@wmg/common/lib/age-to-string";

type EmailResult = {
  questionnaire: {
    title: string;
  };
  results: {
    metadata: {
      text: string;
    };
    answer: {
      metadata: {
        text: string;
      };
      comments?: string;
    };
  }[];
};

type ParentEmailInput = {
  details: {
    nameOfParent: string;
    firstNameOfChild: string;
    lastNameOfChild: string;
    testDateFormatted: string;
    dobChildFormatted: string;
    ageOfChild: string;
  };
  resultText: string;
  developmentResults: EmailResult[];
  communicationResults: EmailResult[];
};

type DoctorEmailInput = ParentEmailInput & {
  minAge: string;
  maxAge: string;
  concern: boolean;
};

const FORMAT = "dddd, MMMM Do YYYY";
const EMAIL_FROM = "WatchMeGrow.care <mail@watchmegrow.care>";
// const EMAIL_TO = "alex@alexgilleran.com";

const mailgun = mailgunJs({
  apiKey: functions.config().mailgun.apikey,
  domain: "auto.watchmegrow.care"
});

/*
 POST with these parameters:
 {
 "recipient_email": <recipient email>
 "subject": <subject>,
 "body": <body>
 }
 */

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post("*", async (req: express.Request, res: express.Response) => {
  try {
    const body = req.body as NotifyFunctionInput;
    const details = body.details;

    if (!details.recipientEmail) {
      res.status(500).send("Error: Missing parameter.");
      console.error("Missing parameter");
      throw new Error("Missing parameter");
    }

    const config = getConfigById(details.siteId);
    const combinedResults = combineAll(body.results);
    const concern = mark(combinedResults);
    const resultStrings = concern
      ? strings.result.concerns
      : strings.result.noConcerns;

    const detailsWithDates = {
      ...details,
      testDateFormatted: moment(details.testDate).format(FORMAT),
      dobChildFormatted: moment(details.dobOfChild).format(FORMAT)
    };

    const parentEmailPromise = sendParentEmail(
      detailsWithDates,
      combinedResults,
      resultStrings,
      config
    );

    const basePromises: Promise<any>[] = [
      parentEmailPromise,
      recordResultsInFirestore(combinedResults, concern, details)
    ];

    const promises = details.doctorEmail
      ? basePromises.concat([
          sendDoctorEmail(
            detailsWithDates,
            combinedResults,
            resultStrings,
            config
          )
        ])
      : basePromises;

    await Promise.all(promises);

    res.status(200).json({ status: "OK" });
  } catch (e) {
    console.error(e);
    res.send(500);
  }
});

const templateBody = fs.readFileSync(
  require.resolve("../../src/notify-email/Results.html"),
  "utf-8"
);

function sendParentEmail(
  details: NotifyFunctionInputDetails,
  combinedResults: CombinedResult[],
  resultStrings: EmailString,
  config: HostConfig
) {
  const templateInput: ParentEmailInput = buildEmailInput(
    details,
    combinedResults,
    resultStrings
  );

  const message = markupJs.up(templateBody, templateInput);

  const params = addCCToParams({
    from: EMAIL_FROM,
    to: details.recipientEmail,
    subject: "WatchMeGrow.care Results for " + details.firstNameOfChild,
    html: message
  });

  return mailgun.messages().send(params);
}

function addCCToParams(params: any) {
  const newParams = { ...params };
  if (functions.config().notifyemail.cc) {
    newParams.cc = functions.config().notifyemail.cc;
  }
  return newParams;
}

function buildEmailInput(
  details: NotifyFunctionInputDetails,
  combinedResults: CombinedResult[],
  resultStrings: EmailString
): DoctorEmailInput {
  const { minMonths, maxMonths } = minMax(
    questionnairesForSubsite(details.siteId)
  );

  return {
    details: {
      nameOfParent: details.nameOfParent,
      firstNameOfChild: details.firstNameOfChild,
      lastNameOfChild: details.lastNameOfChild,
      testDateFormatted: moment(details.testDate).format(FORMAT),
      dobChildFormatted: moment(details.dobOfChild).format(FORMAT),
      ageOfChild: ageInMonthsToString(details.ageInMonths)
    },
    developmentResults: combinedResults.filter(
      result => result.questionnaire.category === "development"
    ),
    communicationResults: combinedResults.filter(
      result => result.questionnaire.category === "communication"
    ),
    resultText: resultStrings.title + " " + resultStrings.subtitle,
    concern: mark(combinedResults),
    minAge: ageInMonthsToString(minMonths),
    maxAge: ageInMonthsToString(maxMonths)
  };
}

const doctorTemplateBody = fs.readFileSync(
  require.resolve("../../src/notify-email/Doctor.html"),
  "utf-8"
);

function sendDoctorEmail(
  details: NotifyFunctionInputDetails,
  combinedResults: CombinedResult[],
  resultStrings: EmailString,
  config: HostConfig
) {
  const doctorEmailInput: DoctorEmailInput = buildEmailInput(
    details,
    combinedResults,
    resultStrings
  );

  const message = markupJs.up(doctorTemplateBody, doctorEmailInput);

  const params = addCCToParams({
    from: EMAIL_FROM,
    to: details.doctorEmail,
    subject:
      "WatchMeGrow.care Results for " +
      details.firstNameOfChild +
      " " +
      details.lastNameOfChild,
    html: message
  });

  return mailgun.messages().send(params);
}

export type FirestoreRecord = {
  results: {
    questionnaire: string;
    answers: { [id: string]: string };
  }[];
  concern: boolean;
  details: {
    recipientEmail: string;
    nameOfParent: string;
    firstNameOfChild: string;
    lastNameOfChild: string;
    genderOfChild: string;
    doctorEmail?: string;
    siteId: string;
    dobAsDate: Date;
  };
  date: Date;
};

function recordResultsInFirestore(
  results: CombinedResult[],
  concern: boolean,
  details: NotifyFunctionInputDetails
) {
  const filteredResults = results.map(result => ({
    questionnaire: result.questionnaire.id,
    answers: _.fromPairs(
      result.results.map(({ answer, metadata }) => [
        metadata.id,
        answer.rawAnswer.value
      ])
    )
  }));

  const record: FirestoreRecord = {
    results: filteredResults,
    concern,
    details: {
      recipientEmail: details.recipientEmail,
      nameOfParent: details.nameOfParent,
      firstNameOfChild: details.firstNameOfChild,
      lastNameOfChild: details.lastNameOfChild,
      genderOfChild: details.genderOfChild,
      doctorEmail: details.doctorEmail,
      siteId: details.siteId,
      dobAsDate: moment(details.dobOfChild).toDate()
    },
    date: moment(details.testDate).toDate()
  };

  return firebase
    .firestore()
    .collection("/results")
    .add(record);
}

export default app;
