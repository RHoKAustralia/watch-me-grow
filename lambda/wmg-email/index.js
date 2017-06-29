"use strict";

let https = require("https");
var aws = require("aws-sdk");
const moment = require("moment");
var ses = new aws.SES();
var markupJs = require("markup-js");
var fs = require("fs");
const fetch = require("isomorphic-fetch");
var dataFunctions = require("wmg-common/data-functions");
var mark = dataFunctions.mark;
var combineAll = dataFunctions.combineAll;
var strings = require("wmg-common/strings");

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

exports.handler = function(event, context) {
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

  const parentEmailPromise = sendParentEmail(event, concern, combinedResults, resultStrings);
  const zapierPromise = sendToZapier(event, concern);
  const basePromises = [parentEmailPromise, zapierPromise];

  const promises = event.details.doctor_email
    ? basePromises.concat([sendDoctorEmail(event, concern, combinedResults, resultStrings)])
    : basePromises;

  Promise.all(promises)
    .then(context.succeed("Successfully executed"))
    .catch(e => context.fail("Internal Error: " + e.message));
};

function sendToZapier(event, concern) {
  return fetch("https://hooks.zapier.com/hooks/catch/2318292/9cdxwr/", {
    method: "POST",
    body: JSON.stringify({
      results: event.results,
      concern: concern,
      details: Object.assign(event.details, {
        ageInDays: moment().diff(moment(event.details.dob_child), 'days')
      })
    }),
    headers: {
      "Content-Type": "application/json"
    }
  });
}

function sendParentEmail(event, concern, combinedResults, resultStrings) {
  const templateBody = fs.readFileSync(__dirname + "/Results.html", "utf-8");

  var message = markupJs.up(templateBody, {
    details: event.details,
    concern: concern,
    allResults: combinedResults,
    resultText: resultStrings.title + " " + resultStrings.subtitle
  });

  var params = {
    Destination: {
      ToAddresses: [event.details.recipient_email],
      CcAddresses: ["mail@watchmegrow.care"]
    },
    Message: {
      Body: {
        Html: {
          Data: message,
          Charset: "UTF-8"
        }
      },
      Subject: {
        Data: "Watch Me Grow Results for " + event.details.first_name_of_child,
        Charset: "UTF-8"
      }
    },
    Source: "mail@watchmegrow.care" //hardcoded verified email source for Amazon SES sandbox
  };

  return new Promise((accept, reject) =>
    ses.sendEmail(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
        reject(err);
      } else {
        accept(data);
      }
    })
  );
}

function sendDoctorEmail(event, concern, combinedResults, resultStrings) {
  const doctorTemplateBody = fs.readFileSync(__dirname + "/Doctor.html", "utf-8");

  var message = markupJs.up(doctorTemplateBody, {
    details: event.details,
    concern: concern,
    allResults: combinedResults,
    resultText: resultStrings.title + " " + resultStrings.subtitle
  });

  var params = {
    Destination: {
      ToAddresses: [event.details.doctor_email],
      CcAddresses: ["mail@watchmegrow.care"]
    },
    Message: {
      Body: {
        Html: {
          Data: message,
          Charset: "UTF-8"
        }
      },
      Subject: {
        Data:
          "Watch Me Grow Results for " +
            event.details.first_name_of_child +
            " " +
            event.details.last_name_of_child,
        Charset: "UTF-8"
      }
    },
    Source: "mail@watchmegrow.care" //hardcoded verified email source for Amazon SES sandbox
  };

  return new Promise((accept, reject) =>
    ses.sendEmail(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
        reject(err);
      } else {
        accept(data);
      }
    })
  );
}
