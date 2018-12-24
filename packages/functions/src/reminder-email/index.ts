import moment from "moment";
const mailgunJs = require("mailgun-js");
import * as markupJs from "markup-js";
import * as fs from "fs";
import _ from "lodash";
import * as functions from "firebase-functions";
import * as firebase from "firebase-admin";

import strings from "@wmg/common/lib/strings";
import questionnaires from "@wmg/common/lib/questionnaires";
import { siteSpecificConfig } from "@wmg/common/lib/site-specific-config";

type ResultsEmailInput = {};

const mailgun = mailgunJs({
  apiKey: functions.config().mailgun.apikey,
  domain: "auto.watchmegrow.care"
});

const reminderTemplateBody = fs.readFileSync(
  require.resolve("../../src/reminder-email/Reminder.html"),
  "utf-8"
);

const subsitesForQuestionnaire = _(siteSpecificConfig)
  .toPairs()
  .filter(([siteId, siteConfig]) => !!siteConfig.questionnaires)
  .flatMap(([siteId, siteConfig]) =>
    siteConfig.questionnaires.map(questionnaireId => ({
      questionnaireId,
      siteId
    }))
  )
  .groupBy(x => x.questionnaireId)
  .mapValues(value => value.map(x => x.siteId))
  .value();

export default async function reminderEmail(pubSubMsg) {
  try {
    const now = moment();

    const questionnaireReminderAges = questionnaires
      .filter(questionnaire => questionnaire.remind_at)
      .map(questionnaire => ({
        id: questionnaire.id,
        minDate: now
          .clone()
          .subtract(questionnaire.remind_at, "months")
          .subtract(1, "days"),
        maxDate: now.clone().subtract(questionnaire.remind_at, "months")
      }));

    const queries = _(questionnaireReminderAges)
      .filter(
        questionnaireAges => !!subsitesForQuestionnaire[questionnaireAges.id]
      )
      .flatMap(questionnaireAges =>
        subsitesForQuestionnaire[questionnaireAges.id].map(subsite => ({
          questionnaireAges,
          subsite
        }))
      )
      .map(({ questionnaireAges, subsite }) => {
        return firebase
          .firestore()
          .collection("results")
          .where("details.dobAsDate", ">", questionnaireAges.minDate.toDate())
          .where("details.dobAsDate", "<=", questionnaireAges.maxDate.toDate())
          .where("details.subsite", "==", subsite)
          .get();
      })
      .value();

    const querySnapshots = await Promise.all(queries);

    const results = _.flatMap(querySnapshots, snapshot => snapshot.docs);

    const reminderPromises = results.map(result => {
      const details = result.get("details");

      return sendReminder(details);
    });

    await Promise.all(reminderPromises);

    console.log(`Successfully reminded ${reminderPromises.length} parents`);

    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

function sendReminder(details) {
  const ageInMonths = moment().diff(
    moment(details.dobAsDate.toDate()),
    "months"
  );

  const message = markupJs.up(reminderTemplateBody, {
    url:
      "https://" +
      (details.subsite ? details.subsite + "." : "") +
      "watchmegrow.care",
    childAge: ageInMonths
  });

  console.log(`Sending reminder to ${details.recipientEmail}`);

  const params = {
    from: "mail@watchmegrow.care",
    to: details.recipientEmail,
    subject: "WatchMeGrow.care Reminder for  " + details.firstNameOfChild,
    html: message
  };

  return mailgun.messages().send(params);
}
