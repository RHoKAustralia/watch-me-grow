'use strict';

let https = require('https');
var aws = require('aws-sdk');
var ses = new aws.SES();
var markupJs = require('markup-js');
var fs = require('fs');
var dataFunctions = require('wmg-common/data-functions');
var mark = dataFunctions.mark;
var combineAll = dataFunctions.combineAll;
var strings = require('wmg-common/strings');

process.env["PATH"] = process.env["PATH"] + ":" + process.env["LAMBDA_TASK_ROOT"];

console.log('Loading function');

/*
 POST with these parameters:
 {
 "recipient_email": <recipient email>
 "subject": <subject>,
 "body": <body>
 }
 */

exports.handler = function (event, context) {
    console.log("Event: " + JSON.stringify(event));

    if (!event.details.recipient_email) {
        context.fail('Error: Missing parameter.');
    }

    fs.readFile(__dirname + '/Results.html', 'utf-8', (err, templateBody) => {
        if (err) {
            // Error
            console.log(err, err.stack);
            context.fail('Internal Error: Failed to load template.')
        } else {
            const combinedResults = combineAll(event.results);
            const concern = mark(combinedResults);
            const resultStrings = concern ? strings.result.concerns : strings.result.noConcerns;

            var message = markupJs.up(templateBody, {
                details: event.details,
                concern: concern,
                allResults: combinedResults,
                resultText: resultStrings.title + ' ' + resultStrings.subtitle
            });

            var params = {
                Destination: {
                    ToAddresses: [
                        event.details.recipient_email
                    ],
                    CcAddresses: [
                        "alex@alexgilleran.com"
                    ]
                },
                Message: {
                    Body: {
                        Html: {
                            Data: message,
                            Charset: 'UTF-8'
                        }
                    },
                    Subject: {
                        Data: 'Watch Me Grow Results for ' + event.details.name_of_child,
                        Charset: 'UTF-8'
                    }
                },
                Source: "alex@alexgilleran.com" //hardcoded verified email source for Amazon SES sandbox
            };

            ses.sendEmail(params, function (err, data) {
                if (err) {
                    console.log(err, err.stack);
                    context.fail('Internal Error: The email could not be sent.');
                } else {
                    console.log(data);           // successful response
                    context.succeed('The email was successfully sent to ' + event.details.recipient_email);
                }
            });
        }
    });


};
