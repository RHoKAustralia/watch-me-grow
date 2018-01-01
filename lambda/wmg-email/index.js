"use strict";

let https = require("https");
var aws = require("aws-sdk");
const moment = require("moment");
const mailgunJs = require("mailgun-js");
var markupJs = require("markup-js");
var fs = require("fs");
const fetch = require("isomorphic-fetch");
var dataFunctions = require("wmg-common/data-functions");
var mark = dataFunctions.mark;
var combineAll = dataFunctions.combineAll;
var strings = require("wmg-common/strings");
const _ = require("lodash");

const FORMAT = "dddd, MMMM Do YYYY";
const EMAIL_FROM = "WatchMeGrow.care <mail@watchmegrow.care>";

const mailgun = mailgunJs({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: "auto.watchmegrow.care"
});

process.env["PATH"] =
  process.env["PATH"] + ":" + process.env["LAMBDA_TASK_ROOT"];

console.log("Loading function");

const ZAPIER_ENDPOINTS = {
  australia: "https://hooks.zapier.com/hooks/catch/2318292/9cdxwr/",
  dubai: "https://hooks.zapier.com/hooks/catch/2318292/53nxsk/"
};

/*
 POST with these parameters:
 {
 "recipient_email": <recipient email>
 "subject": <subject>,
 "body": <body>
 }
 */

exports.handler = function(event, context, callback) {
  console.log("Event: " + JSON.stringify(event));

  if (!event.details.recipient_email) {
    context.fail("Error: Missing parameter.");
  }

  const combinedResults = combineAll(event.results);
  const flag = mark(combinedResults);
  const concern = flag !== "NO_FLAG";
  const resultStrings = concern
    ? strings.result.concerns
    : strings.result.noConcerns;

  event.details = Object.assign(event.details, {
    test_date_formatted: moment(event.details.test_date).format(FORMAT),
    dob_child_formatted: moment(event.details.dob_child).format(FORMAT)
  });

  const parentEmailPromise = sendParentEmail(
    //Promise.resolve();
    event,
    concern,
    combinedResults,
    resultStrings
  );
  const zapierPromise = sendToZapier(event, concern); //Promise.resolve();
  const basePromises = [
    parentEmailPromise,
    zapierPromise,
    addToReminderList(event)
  ];

  const promises = event.details.doctor_email
    ? basePromises.concat([
        sendDoctorEmail(event, concern, combinedResults, resultStrings)
      ])
    : basePromises;

  Promise.all(promises)
    .then(result => {
      callback(null, result);
    })
    .catch(e => callback(e));
};

function sendToZapier(event, concern) {
  return fetch(getZapierEndpoint(event), {
    method: "POST",
    body: JSON.stringify({
      results: event.results,
      concern: concern,
      details: Object.assign(event.details, {
        ageInDays: moment().diff(moment(event.details.dob_child), "days")
      })
    }),
    headers: {
      "Content-Type": "application/json"
    }
  });
}

function getZapierEndpoint(event) {
  return ZAPIER_ENDPOINTS[event.details.subsite];
}

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
    subject: "WatchMeGrow.care Results for " + event.details.first_name_of_child,
    html: message
  };

  return mailgun.messages().send(params);
}

const doctorTemplateBody = fs.readFileSync(__dirname + "/Doctor.html", "utf-8");

function sendDoctorEmail(event, concern, combinedResults, resultStrings) {
  var message = markupJs.up(doctorTemplateBody, {
    details: event.details,
    concern: concern,
    allResults: combinedResults,
    resultText: resultStrings.title + " " + resultStrings.subtitle
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

const reminderTemplateBody = fs.readFileSync(
  __dirname + "/Reminder.html",
  "utf-8"
);

function addToReminderList(event) {
  const completed = Object.keys(event.results).reduce((soFar, current) => {
    soFar[current] = true;
    return soFar;
  }, {});

  const data = {
    completed,
    dob: event.details.dob_child
  };

  const newVars = {};
  newVars[event.details.first_name_of_child] = data;

  const varsPromise = mailgun
    .lists("reminders@auto.watchmegrow.care")
    .members(event.details.recipient_email)
    .info()
    .then(memberObj => {
      const member = memberObj.member;
      return Promise.resolve(member && member.vars ? member.vars : {});
    })
    .catch(e => Promise.resolve({}));

  return varsPromise.then(vars => {
    return mailgun.lists("reminders@auto.watchmegrow.care").members().create({
      name: event.details.name_of_parent,
      address: event.details.recipient_email,
      upsert: "true",
      vars: _.merge(vars, newVars)
    });
  });
}
