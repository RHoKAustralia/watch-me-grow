import * as moment from "moment";
const mailgunJs = require("mailgun-js");
import * as fs from "fs";
import * as fetch from "isomorphic-fetch";
import * as _ from "lodash";
import * as markupJs from "markup-js";
import * as express from "express";
import * as bodyParser from "body-parser";

import { mark, combineAll } from "@wmg/common/data-functions";
import questionnairesForSubsite from "@wmg/common/questionnaires-for-subsite";
import strings from "@wmg/common/strings";
import minMax from "@wmg/common/min-max";

const FORMAT = "dddd, MMMM Do YYYY";
const EMAIL_FROM = "WatchMeGrow.care <mail@watchmegrow.care>";

const mailgun = mailgunJs({
  apiKey: process.env.MAILGUN_API_KEY,
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

app.post("/", async (req, res) => {
  try {
    const details = req.body.details;

    if (!details.recipient_email) {
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
      test_date_formatted: moment(details.test_date).format(FORMAT),
      dob_child_formatted: moment(details.dob_child).format(FORMAT)
    };

    const parentEmailPromise = sendParentEmail(
      req.body,
      concern,
      combinedResults,
      resultStrings
    );
    const basePromises = [parentEmailPromise, addToReminderList(req.body)];

    const promises = details.doctor_email
      ? basePromises.concat([
          sendDoctorEmail(req.body, concern, combinedResults, resultStrings)
        ])
      : basePromises;

    const results = await Promise.all(promises);
  } catch (e) {
    res.send(500);
  }
});

const templateBody = fs.readFileSync(__dirname + "/Results.html", "utf-8");

function sendParentEmail(event, concern, combinedResults, resultStrings) {
  var message = markupJs.up(templateBody, {
    details: event.details,
    concern: concern,
    allResults: combinedResults,
    resultText: resultStrings.title + " " + resultStrings.subtitle
  });

  var params = {
    from: EMAIL_FROM,
    to: event.details.recipient_email,
    cc: EMAIL_FROM,
    subject:
      "WatchMeGrow.care Results for " + event.details.first_name_of_child,
    html: message
  };

  return mailgun.messages().send(params);
}

const doctorTemplateBody = fs.readFileSync(__dirname + "/Doctor.html", "utf-8");

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
    to: event.details.doctor_email,
    subject:
      "WatchMeGrow.care Results for " +
      event.details.first_name_of_child +
      " " +
      event.details.last_name_of_child,
    html: message
  };

  return mailgun.messages().send(params);
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
