import * as moment from "moment";
const mailgunJs = require("mailgun-js");
import * as fs from "fs";
import * as _ from "lodash";
import * as markupJs from "markup-js";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as functions from "firebase-functions";
import * as firebase from "firebase-admin";
import * as cors from "cors";

import questionnairesForSubsite from "@wmg/common/src/questionnaires-for-subsite";
import {
  mark,
  combineAll,
  CombinedResult
} from "@wmg/common/src/data-functions";
import strings, { EmailString } from "@wmg/common/src/strings";
import minMax from "@wmg/common/src/min-max";
import {
  NotifyFunctionInput,
  NotifyFunctionInputDetails
} from "@wmg/common/src/notify-function-input";
import getSiteSpecificConfig, {
  HostConfig
} from "@wmg/common/src/site-specific-config";

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
const EMAIL_TO = "alex@alexgilleran.com";

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

app.post("/", async (req: express.Request, res: express.Response) => {
  try {
    const body = req.body as NotifyFunctionInput;
    const details = body.details;

    if (!details.recipientEmail) {
      res.status(500).send("Error: Missing parameter.");
      console.error("Missing parameter");
      throw new Error("Missing parameter");
    }

    const config = getSiteSpecificConfig(details.subsite);
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
      resultStrings
    );

    const basePromises = [
      parentEmailPromise,
      recordResultsInFirestore(combinedResults, concern, details)
    ];

    const promises = details.doctorEmail
      ? basePromises.concat([
          sendDoctorEmail(detailsWithDates, combinedResults, resultStrings)
        ])
      : basePromises;

    const results = await Promise.all(promises);

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

  var message = markupJs.up(templateBody, templateInput);

  var params = {
    from: EMAIL_FROM,
    to: details.recipientEmail,
    cc: !config.dev && EMAIL_FROM,
    subject: "WatchMeGrow.care Results for " + details.firstNameOfChild,
    html: message
  };

  return mailgun.messages().send(params);
}

function buildEmailInput(
  details: NotifyFunctionInputDetails,
  combinedResults: CombinedResult[],
  resultStrings: EmailString
): DoctorEmailInput {
  return {
    details: {
      nameOfParent: details.nameOfParent,
      firstNameOfChild: details.firstNameOfChild,
      lastNameOfChild: details.lastNameOfChild,
      testDateFormatted: moment(details.testDate).format(FORMAT),
      dobChildFormatted: moment(details.dobOfChild).format(FORMAT),
      ageOfChild:
        details.ageInMonths < 24
          ? details.ageInMonths + " months"
          : Math.floor(details.ageInMonths / 12) + " years"
    },
    developmentResults: combinedResults.filter(
      result => result.questionnaire.category === "development"
    ),
    communicationResults: combinedResults.filter(
      result => result.questionnaire.category === "communication"
    ),
    resultText: resultStrings.title + " " + resultStrings.subtitle,
    concern: mark(combinedResults),
    minAge: "",
    maxAge: "'"
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
  const questionnaires = questionnairesForSubsite(details.subsite);
  const { minMonths, maxMonths } = minMax(questionnaires);

  const doctorEmailInput: DoctorEmailInput = buildEmailInput(
    details,
    combinedResults,
    resultStrings
  );

  var message = markupJs.up(doctorTemplateBody, doctorEmailInput);

  var params = {
    from: EMAIL_FROM,
    to: details.doctorEmail,
    cc: !config.dev && EMAIL_FROM,
    subject:
      "WatchMeGrow.care Results for " +
      details.firstNameOfChild +
      " " +
      details.lastNameOfChild,
    html: message
  };

  return mailgun.messages().send(params);
}

function recordResultsInFirestore(results: any[], concern, details) {
  const filteredResults = results.map(result => ({
    questionnaire: result.questionnaire.id,
    answers: _.fromPairs(
      result.results.map(({ answer }, i) => [
        result.questionnaire.questions[i].id,
        answer.value
      ])
    )
  }));

  return firebase
    .firestore()
    .collection("/results")
    .add({
      results: filteredResults,
      concern,
      details: { ...details, dobAsDate: moment(details.dobOfChild).toDate() },
      date: moment(details.testDate).toDate()
    });
}

export default app;
