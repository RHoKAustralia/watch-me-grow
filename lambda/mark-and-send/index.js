//https://hooks.zapier.com/hooks/catch/2318292/9cdxwr/

let https = require("https");
const fetch = require("isomorphic-fetch");
var dataFunctions = require("wmg-common/data-functions");
var markupJs = require("markup-js");
var mark = dataFunctions.mark;
var combineAll = dataFunctions.combineAll;
var strings = require("wmg-common/strings");
const fs = require('fs');

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

  fs.readFile(__dirname + "/Results.html", "utf-8", (err, templateBody) => {
    if (err) {
      // Error
      console.log(err, err.stack);
      context.fail("Internal Error: Failed to load template.");
    } else {
      const combinedResults = combineAll(event.results);
      const concern = mark(combinedResults);
      const resultStrings = concern
        ? strings.result.concerns
        : strings.result.noConcerns;

      var message = markupJs.up(templateBody, {
        details: event.details,
        concern: concern,
        allResults: combinedResults,
        resultText: resultStrings.title + " " + resultStrings.subtitle
      });

      const x = {
        results: event.results,
        concern: concern,
        details: event.details,
        message: message
      };

      fetch("https://hooks.zapier.com/hooks/catch/2318292/9cdxwr/", {
        method: "POST",
        body: JSON.stringify(x),
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
  });
};
