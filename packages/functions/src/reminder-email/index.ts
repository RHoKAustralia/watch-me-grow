import moment from "moment";
const mailgunJs = require("mailgun-js");
import * as markupJs from "markup-js";
import * as fs from "fs";
import _ from "lodash";
import * as functions from "firebase-functions";
import * as firebase from "firebase-admin";

import questionnaires from "@wmg/common/lib/questionnaires";
import { sites, getConfigById } from "@wmg/common/lib/site-specific-config";
import buildi18n from "../i18n";
import { FirestoreRecordDetails } from "../notify-email";

type ResultsEmailInput = {};

const mailgun = mailgunJs({
  apiKey: functions.config().mailgun.apikey,
  domain: "auto.watchmegrow.care"
});

const reminderTemplateBody = fs.readFileSync(
  require.resolve("../../src/reminder-email/Reminder.html"),
  "utf-8"
);

const subsitesForQuestionnaire = _(sites)
  .flatMap(siteConfig =>
    siteConfig.questionnaires.map(questionnaireId => ({
      questionnaireId,
      siteConfig
    }))
  )
  .groupBy(x => x.questionnaireId)
  .mapValues(value => value.map(x => x.siteConfig.id))
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
        // console.log(
        //   `${
        //     questionnaireAges.id
        //   } = from ${questionnaireAges.minDate.toDate()} to ${questionnaireAges.maxDate.toDate()} and ${subsite}`
        // );

        return firebase
          .firestore()
          .collection("results")
          .where("details.dobAsDate", ">", questionnaireAges.minDate.toDate())
          .where("details.dobAsDate", "<=", questionnaireAges.maxDate.toDate())
          .where("details.siteId", "==", subsite)
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

async function sendReminder(details: FirestoreRecordDetails) {
  const ageInMonths = moment().diff(
    moment(details.dobAsDate.toDate()),
    "months"
  );

  const t = await buildi18n(details.language);
  const siteConfig = getConfigById(details.siteId);

  const message = markupJs.up(
    reminderTemplateBody,
    {
      url: "https://" + siteConfig.host,
      childAge: ageInMonths
    },
    {
      globals: { t: { t } }
    }
  );

  console.log(`Sending reminder to ${details.recipientEmail}`);

  const params = {
    from: "Watch Me Grow <mail@watchmegrow.care>",
    to: details.recipientEmail,
    subject: `${t("emails.reminder.subject")} ${details.firstNameOfChild}`,
    html: message
  };

  return mailgun.messages().send(params);
  // return Promise.resolve();
}
