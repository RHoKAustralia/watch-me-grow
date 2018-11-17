import * as moment from "moment";
const mailgunJs = require("mailgun-js");
import * as markupJs from "markup-js";
import * as fs from "fs";
import * as _ from "lodash";
import * as functions from "firebase-functions";
import * as firebase from "firebase-admin";

import * as strings from "@wmg/common/src/strings";
import getQuestionnairesForSubsite from "@wmg/common/src/questionnaires-for-subsite";

const mailgun = mailgunJs({
  apiKey: functions.config().mailgun.apikey,
  domain: "auto.watchmegrow.care"
});

const reminderTemplateBody = fs.readFileSync(
  __dirname + "/Reminder.html",
  "utf-8"
);

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

export default async function reminderEmail(message) {
  try {

     mailgun
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

      return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

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
