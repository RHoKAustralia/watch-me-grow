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

import { mark, combineAll } from "@wmg/common/src/data-functions";
import * as strings from "@wmg/common/src/strings";
import * as minMax from "@wmg/common/src/min-max";

const FORMAT = "dddd, MMMM Do YYYY";
const EMAIL_FROM = "WatchMeGrow.care <mail@watchmegrow.care>";
const EMAIL_TO = "alex@alexgilleran.com";

const mailgun = mailgunJs({
  apiKey: functions.config().mailgun.apikey,
  domain: "auto.watchmegrow.care"
});

process.env["PATH"] =
  process.env["PATH"] + ":" + process.env["LAMBDA_TASK_ROOT"];

console.log("Loading function");

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

app.post("/", async (req, res) => {
  try {
    const details = req.body.details;

    if (!details.recipientEmail) {
      res.status(500).send("Error: Missing parameter.");
      console.error("Missing parameter");
      throw new Error("Missing parameter");
    }

    const combinedResults = combineAll(req.body.results);
    const flag = mark(combinedResults);
    const concern = flag !== "NO_FLAG";
    const resultStrings = concern
      ? strings.result.concerns
      : strings.result.noConcerns;

    const detailsWithDates = {
      ...details,
      testDateFormatted: moment(details.testDate).format(FORMAT),
      dobChildFormatted: moment(details.dobOfChild).format(FORMAT)
    };

    // const parentEmailPromise = sendParentEmail(
    //   detailsWithDates,
    //   concern,
    //   combinedResults,
    //   resultStrings
    // );
    const basePromises = [
      // parentEmailPromise,
      // addToReminderList(req.body),
      recordResultsInFirestore(combinedResults, concern, details)
    ];

    const promises = details.doctorEmail
      ? basePromises.concat([
          sendDoctorEmail(req.body, concern, combinedResults, resultStrings)
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

function sendParentEmail(details, concern, combinedResults, resultStrings) {
  var message = markupJs.up(templateBody, {
    details: details,
    concern: concern,
    allResults: combinedResults,
    resultText: resultStrings.title + " " + resultStrings.subtitle
  });

  var params = {
    from: EMAIL_FROM,
    to: EMAIL_TO, //event.details.recipient_email,
    // cc: EMAIL_FROM,
    subject: "WatchMeGrow.care Results for " + details.firstNameOfChild,
    html: message
  };

  return mailgun.messages().send(params);
}

const doctorTemplateBody = fs.readFileSync(
  require.resolve("../../src/notify-email/Doctor.html"),
  "utf-8"
);

function sendDoctorEmail(event, concern, combinedResults, resultStrings) {
  const questionnaires = questionnairesForSubsite(event.details.subsite);
  const { minMonths, maxMonths } = minMax(questionnaires);

  var message = markupJs.up(doctorTemplateBody, {
    details: event.details,
    concern: concern,
    allResults: combinedResults,
    resultText: resultStrings.title + " " + resultStrings.subtitle,
    minMonths: minMonths,
    maxMonths: maxMonths
  });

  var params = {
    from: EMAIL_FROM,
    to: EMAIL_TO, //event.details.doctor_email,
    subject:
      "WatchMeGrow.care Results for " +
      event.details.firstNameOfChild +
      " " +
      event.details.lastNameOfChild,
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
      details,
      date: moment(details.testDate).toDate()
    });
}

function addToReminderList(event) {
  return Promise.resolve();
}

// function addToReminderList(event) {
//   const completed = Object.keys(event.results).reduce((soFar, current) => {
//     soFar[current] = true;
//     return soFar;
//   }, {});

//   const data = {
//     completed,
//     dob: event.details.dob_child,
//     subsite: event.details.subsite
//   };

//   const newVars = {};
//   newVars[event.details.first_name_of_child] = data;

//   const varsPromise = mailgun
//     .lists("reminders@auto.watchmegrow.care")
//     .members(event.details.recipient_email)
//     .info()
//     .then(memberObj => {
//       const member = memberObj.member;
//       return Promise.resolve(member && member.vars ? member.vars : {});
//     })
//     .catch(e => Promise.resolve({}));

//   return varsPromise.then(vars => {
//     return mailgun
//       .lists("reminders@auto.watchmegrow.care")
//       .members()
//       .create({
//         name: event.details.name_of_parent,
//         address: event.details.recipient_email,
//         upsert: "true",
//         vars: _.merge(vars, newVars)
//       });
//   });
// }

export default app;
