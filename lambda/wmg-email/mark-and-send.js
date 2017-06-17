//https://hooks.zapier.com/hooks/catch/2318292/9cdxwr/

let https = require("https");
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
  const concern = mark(combinedResults);
//   const resultStrings = concern
//     ? strings.result.concerns
//     : strings.result.noConcerns;

  

  fetch("https://hooks.zapier.com/hooks/catch/2318292/9cdxwr/", {
    method: "POST",
    body: JSON.stringify(combinedResults),
    headers: {
      "Content-Type": "application/json"
    }
  });
};
