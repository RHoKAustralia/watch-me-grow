'use strict';

let https = require('https');
var aws = require('aws-sdk');
var ses = new aws.SES();
var mark = require('markup-js');
var fs = require('fs');

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

    if (event.recipient_email === undefined || event.subject === undefined) {
        context.fail('Error: Missing parameter.');
    }

    fs.readFile(__dirname + '/Results.html', 'utf-8', (err, data) => {
        if (err) {
            // Error
            console.log(err, err.stack);
            context.fail('Internal Error: Failed to load template.')
        } else {
            var templateBody = data;
            var message = mark.up(templateBody, event);

            var params = {
                Destination: {
                    ToAddresses: [
                        event.recipient_email
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
                        Data: event.subject,
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
                    context.succeed('The email was successfully sent to ' + event.recipient_email);
                }
            });
        }
    });


};
