'use strict';
let https = require('https');
var aws = require('aws-sdk');
var ses = new aws.SES();
var s3 = new aws.S3();

var config = {
    "templateBucket" : "wmg-email",
    "templateKey" : "Templates/Results.html",
}

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


    s3.getObject({
        Bucket: config.templateBucket, 
        Key: config.templateKey
    }, function (err, data) {
      if (err) {
            // Error
            console.log(err, err.stack);
            context.fail('Internal Error: Failed to load template from s3.')
      } else {
            var templateBody = data.Body.toString();

            var mark = require('markup-js');
            var message = mark.up(templateBody, event);

            var params = {
                Destination: {
                    ToAddresses: [
                      event.recipient_email
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
                Source: "acicartagena@gmail.com", //hardcoded verified email source for Amazon SES sandbox
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