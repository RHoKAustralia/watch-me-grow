"use strict";

let https = require("https");
var aws = require("aws-sdk");
const moment = require("moment");
const mailgunJs = require("mailgun-js");
var markupJs = require("markup-js");
var fs = require("fs");
var strings = require("wmg-common/strings");
var questionnaires = require("wmg-common/questionnaires");
const _ = require("lodash");

const mailgun = mailgunJs({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: "auto.watchmegrow.care"
});

process.env["PATH"] =
  process.env["PATH"] + ":" + process.env["LAMBDA_TASK_ROOT"];

const questionnaireReminderAges = questionnaires
  .filter(questionnaire => questionnaire.remind_at)
  .map(questionnaire => ({
    id: questionnaire.id,
    remindAgeInDays: moment.duration(questionnaire.remind_at, "months").asDays()
  }));

exports.handler = function(event, context, callback) {
  console.log(questionnaireReminderAges);

  return mailgun
    .lists("reminders@auto.watchmegrow.care")
    .members()
    .list()
    .then(members => {
      const children = _.flatMap(members.items, member => {
        return Object.keys(member.vars).map(varKey =>
          Object.assign(member.vars[varKey], {
            name: varKey,
            email: member.address,
            ageInDays: moment().diff(moment(member.vars[varKey].dob), "days")
          })
        );
      });

      console.log(children);

      const toBeReminded = children.filter(child =>
        questionnaireReminderAges.some(
          questionnaire =>
            !child.completed[questionnaire.id] &&
            questionnaire.remindAgeInDays === child.ageInDays
        )
      );

      const promises = toBeReminded.map(child => sendReminder(child));

      return Promise.all(promises);
    })
    .then(result => {
      console.log(result);
      callback(null, "Successfully executed");
    })
    .catch(e => callback(e));
};

const reminderTemplateBody = fs.readFileSync(
  __dirname + "/Reminder.html",
  "utf-8"
);

function sendReminder(child) {
  var params = {
    from: "mail@watchmegrow.care",
    to: child.email,
    subject: "WatchMeGrow.care Reminder for  " + child.name,
    html: reminderTemplateBody
  };

  return mailgun.messages().send(params);
}
