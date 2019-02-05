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
import i18next from "i18next";

import questionnairesForSubsite from "@wmg/common/lib/questionnaires-for-subsite";
import {
  mark,
  combineAll,
  CombinedResult
} from "@wmg/common/lib/data-functions";
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
import buildi18n from "../i18n";

type EmailResult = {
  questionnaire: {
    title: string;
  };
  results: {
    questionText: string;
    answer: {
      answerText: string;
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

    const t = await buildi18n(body.details.language);

    const config = getConfigById(details.siteId);
    const combinedResults = combineAll(body.results, t);
    const concern = mark(combinedResults);
    const resultString = concern
      ? t("results.redFlag")
      : t("results.greenFlag");

    const detailsWithDates = {
      ...details,
      testDateFormatted: moment(details.testDate).format(FORMAT),
      dobChildFormatted: moment(details.dobOfChild).format(FORMAT)
    };

    const parentEmailPromise = sendParentEmail(
      detailsWithDates,
      combinedResults,
      resultString,
      config,
      t
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
            resultString,
            config,
            t
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
  resultString: string,
  config: HostConfig,
  t: i18next.TFunction
) {
  const templateInput: ParentEmailInput = buildEmailInput(
    details,
    combinedResults,
    resultString,
    t
  );

  const message = markupJs.up(templateBody, { ...templateInput, t: { t } });

  console.log(message);

  return Promise.resolve();

  // const params = addCCToParams({
  //   from: EMAIL_FROM,
  //   to: details.recipientEmail,
  //   subject: "WatchMeGrow.care Results for " + details.firstNameOfChild,
  //   html: message
  // });

  // return mailgun.messages().send(params);
}

function addCCToParams(params: any) {
  const newParams = { ...params };
  if (functions.config().notifyemail && functions.config().notifyemail.cc) {
    newParams.cc = functions.config().notifyemail.cc;
  }
  return newParams;
}

function buildEmailInput(
  details: NotifyFunctionInputDetails,
  combinedResults: CombinedResult[],
  resultString: string,
  t: i18next.TFunction
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
      ageOfChild: ageInMonthsToString(details.ageInMonths, t)
    },
    developmentResults: combinedResults.filter(
      result => result.questionnaire.category === "development"
    ),
    communicationResults: combinedResults.filter(
      result => result.questionnaire.category === "communication"
    ),
    resultText: resultString,
    concern: mark(combinedResults),
    minAge: ageInMonthsToString(minMonths, t),
    maxAge: ageInMonthsToString(maxMonths, t)
  };
}

const doctorTemplateBody = fs.readFileSync(
  require.resolve("../../src/notify-email/Doctor.html"),
  "utf-8"
);

function sendDoctorEmail(
  details: NotifyFunctionInputDetails,
  combinedResults: CombinedResult[],
  resultString: string,
  config: HostConfig,
  t: i18next.TFunction
) {
  const doctorEmailInput: DoctorEmailInput = buildEmailInput(
    details,
    combinedResults,
    resultString,
    t
  );

  const message = markupJs.up(doctorTemplateBody, doctorEmailInput, {
    pipes: {
      t
    }
  });

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

export type FirestoreRecordDetails = {
  recipientEmail: string;
  nameOfParent: string;
  firstNameOfChild: string;
  lastNameOfChild: string;
  genderOfChild: string;
  doctorEmail?: string;
  siteId: string;
  dobAsDate: Date;
  language: string;
};

export type FirestoreRecord = {
  results: {
    questionnaire: string;
    answers: { [id: string]: string };
  }[];
  concern: boolean;
  details: FirestoreRecordDetails;
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
      dobAsDate: moment(details.dobOfChild).toDate(),
      language: details.language
    },
    date: moment(details.testDate).toDate()
  };

  return firebase
    .firestore()
    .collection("/results")
    .add(record);
}

export default app;
