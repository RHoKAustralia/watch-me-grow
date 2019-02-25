import moment from "moment";
const mailgunJs = require("mailgun-js");
import * as fs from "fs";
import groupBy = require("lodash/groupBy");
import fromPairs = require("lodash/fromPairs");
import * as markupJs from "markup-js";
import express from "express";
import * as bodyParser from "body-parser";
import * as functions from "firebase-functions";
import * as firebase from "firebase-admin";
import cors from "cors";
import i18next from "i18next";
import { Timestamp } from "@google-cloud/firestore";

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
  results: {
    [category: string]: {
      [subcategory: string]: EmailResult[];
    };
  };
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

    const detailsWithDates = {
      ...details,
      testDateFormatted: moment(details.testDate).format(FORMAT),
      dobChildFormatted: moment(details.dobOfChild).format(FORMAT)
    };

    const parentEmailPromise = sendParentEmail(
      detailsWithDates,
      combinedResults,
      config,
      t
    );

    const basePromises: Promise<any>[] = [
      parentEmailPromise,
      recordResultsInFirestore(combinedResults, concern, details)
    ];

    const promises = details.doctorEmail
      ? basePromises.concat([
          sendDoctorEmail(detailsWithDates, combinedResults, config, t)
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
  config: HostConfig,
  t: i18next.TFunction
) {
  const templateInput: ParentEmailInput = buildEmailInput(
    details,
    combinedResults,
    t
  );

  const message = markupJs.up(
    templateBody,
    {
      ...templateInput
    },
    {
      globals: { t: { t } }
    }
  );

  const params = addCCToParams({
    from: EMAIL_FROM,
    to: details.recipientEmail,
    subject: `${t("emails.results.subject")} ${details.firstNameOfChild}`,
    html: message
  });

  return mailgun.messages().send(params);
}

function addCCToParams(params: any) {
  const newParams = { ...params };
  if (functions.config().notifyemail && functions.config().notifyemail.cc) {
    newParams.cc = functions.config().notifyemail.cc;
  }
  return newParams;
}

const subcategoryHeadingLookup = {
  development: "emails.results.developmentHeading",
  communication: "emails.results.socialHeading"
};

function buildEmailInput(
  details: NotifyFunctionInputDetails,
  combinedResults: CombinedResult[],
  concerns: { [key: string]: boolean },
  t: i18next.TFunction
): DoctorEmailInput {
  const { minMonths, maxMonths } = minMax(
    questionnairesForSubsite(details.siteId)
  );

  const groupedByCategory = groupBy(
    combinedResults,
    (result: CombinedResult) => result.questionnaire.category
  );

  const results = Object.keys(groupedByCategory).map(category => {
    const prefix = `results.${category}`;
    const concern = concerns[category];
    const groupedBySubcategory = groupBy(
      groupedByCategory[category],
      result => result.questionnaire.subcategory
    );

    return {
      heading: `${prefix}.heading`,
      resultText: `${prefix}.${concern ? "concern" : "noConcern"}`,
      subcategories: Object.keys(groupedBySubcategory).map(subcategory => {
        return {
          subcategoryHeading: subcategoryHeadingLookup[subcategory],
          questionnaires: groupedBySubcategory[subcategory]
        };
      })
    };
  });

  return {
    details: {
      nameOfParent: details.nameOfParent,
      firstNameOfChild: details.firstNameOfChild,
      lastNameOfChild: details.lastNameOfChild,
      testDateFormatted: moment(details.testDate).format(FORMAT),
      dobChildFormatted: moment(details.dobOfChild).format(FORMAT),
      ageOfChild: ageInMonthsToString(details.ageInMonths, t)
    },
    results,
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
  config: HostConfig,
  t: i18next.TFunction
) {
  const doctorEmailInput: DoctorEmailInput = buildEmailInput(
    details,
    combinedResults,
    t
  );

  const message = markupJs.up(
    doctorTemplateBody,
    {
      ...doctorEmailInput
    },
    {
      globals: { t: { t } }
    }
  );

  const params = addCCToParams({
    from: EMAIL_FROM,
    to: details.doctorEmail,
    subject: `${t("emails.doctor.subject")} ${details.firstNameOfChild} ${
      details.lastNameOfChild
    }`,
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
  dobAsDate: Timestamp;
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
    answers: fromPairs(
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
      dobAsDate: Timestamp.fromDate(moment(details.dobOfChild).toDate()),
      language: details.language
    },
    date: moment(details.testDate).toDate()
  };

  if (!record.details.doctorEmail) {
    delete record.details.doctorEmail;
  }

  return firebase
    .firestore()
    .collection("/results")
    .add(record);
}

export default app;
