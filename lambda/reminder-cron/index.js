"use strict";

const https = require("https");
const aws = require("aws-sdk");
const moment = require("moment");
const mailgunJs = require("mailgun-js");
const markupJs = require("markup-js");
const fs = require("fs");
const strings = require("wmg-common/strings");
const getQuestionnairesForSubsite = require("wmg-common/questionnaires-for-subsite");
const _ = require("lodash");

const mailgun = mailgunJs({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: "auto.watchmegrow.care"
});

process.env["PATH"] =
  process.env["PATH"] + ":" + process.env["LAMBDA_TASK_ROOT"];

function questionnaireReminderAges(subsite) {
  return getQuestionnairesForSubsite(subsite)
    .filter(questionnaire => questionnaire.remind_at)
    .map(questionnaire => ({
      id: questionnaire.id,
      remindAgeInDays: moment
        .duration(questionnaire.remind_at, "months")
        .asDays()
    }));
}

const reminderTemplateBody = fs.readFileSync(
  __dirname + "/Reminder.html",
  "utf-8"
);

exports.handler = function(event, context, callback) {
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

      const toBeReminded = children.filter(child =>
        questionnaireReminderAges(child.subsite).some(
          questionnaire =>
            !child.completed[questionnaire.id] &&
            questionnaire.remindAgeInDays === child.ageInDays
        )
      );

      console.log("Reminding:");
      console.log(toBeReminded);

      const promises = toBeReminded.map(child =>
        sendReminder(
          child,
          Math.round(moment.duration(child.ageInDays, "days").asMonths())
        )
      );

      return Promise.all(promises);
    })
    .then(result => {
      console.log("Done");
      callback(null, "Successfully executed");
    })
    .catch(e => callback(e));
};

function sendReminder(child, ageInMonths) {
  var message = markupJs.up(reminderTemplateBody, {
    url:
      "https://" +
      (child.subsite ? child.subsite + "." : "") +
      "watchmegrow.care",
    childAge: ageInMonths
  });

  var params = {
    from: "mail@watchmegrow.care",
    to: child.email,
    subject: "WatchMeGrow.care Reminder for  " + child.name,
    html: message
  };

  return mailgun.messages().send(params);
}
