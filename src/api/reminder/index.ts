import moment from "moment";
// @ts-ignore
import * as markupJs from "markup-js";
import * as fs from "fs";
import _ from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import mailgun, { EMAIL_FROM } from "src/api/mailgun";

import questionnaires from "src/common/questionnaires";
import { sites, getConfigById } from "src/common//site-specific-config";
import buildi18n from "../i18n";
import { getResults } from "src/db/db";
import { NotifyFunctionInputDetails } from "src/common/notify-function-input";
import isAdmin from "../is-admin";

const reminderTemplateBody = fs.readFileSync(
  require.resolve("src/api/reminder/Reminder.html"),
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

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== "POST") {
      res
        .status(404)
        .json({ result: "Error", message: "Only POSTs are allowed" });
      return;
    }

    if (!isAdmin(req, res)) {
      return;
    }

    const now = moment.utc();

    /** An array of each questionnaire's id along with min and max age range
     *  for children whose guardians need reminding today (usually 1 day apart) */
    const questionnaireReminderAges = questionnaires
      .filter(questionnaire => questionnaire.remindAt)
      .map(questionnaire => ({
        questionnaireId: questionnaire.id,
        minDate: now.clone().subtract(questionnaire.remindAt, "months"),
        maxDate: now
          .clone()
          .subtract(questionnaire.remindAt, "months")
          .add(1, "days")
      }));

    /** An array of zero-arg fns that when executed will fetch the results
     * related to children whose guardians need reminding today.
     */
    const questionnaireReminderFns = _(questionnaireReminderAges)
      .filter(
        questionnaireAges =>
          !!subsitesForQuestionnaire[questionnaireAges.questionnaireId]
      )
      .flatMap(questionnaireAges =>
        subsitesForQuestionnaire[questionnaireAges.questionnaireId].map(
          subsite => ({
            questionnaireAges,
            subsite
          })
        )
      )
      .map(({ questionnaireAges, subsite }) => {
        // console.log(
        //   `${
        //     questionnaireAges.id
        //   } = from ${questionnaireAges.minDate.toDate()} to ${questionnaireAges.maxDate.toDate()} and ${subsite}`
        // );

        return () =>
          getResults(
            subsite,
            0,
            Number.MAX_SAFE_INTEGER,
            questionnaireAges.minDate,
            questionnaireAges.maxDate
          );
      })
      .value();

    // Get each set of people to be reminded one after the other and remind
    // them one after the other so we don't hit connection/rate limits etc.
    let reminderCounter = 0;
    for (let reminderFn of questionnaireReminderFns) {
      const remindersToSend = await reminderFn();

      for (let reminderToSend of remindersToSend) {
        await sendReminder(reminderToSend.details);
        reminderCounter++;
      }
    }

    console.log(`Successfully reminded ${reminderCounter} parents`);

    res.status(200).json({ result: "Success" });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      result: "Error"
    });
  }
};

async function sendReminder(details: NotifyFunctionInputDetails) {
  const ageInMonths = moment().diff(moment(details.dobOfChild), "months");

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
    from: EMAIL_FROM,
    to: details.recipientEmail,
    subject: `${t("emails.reminder.subject")} ${details.firstNameOfChild}`,
    html: message
  };

  return await mailgun.messages().send(params);
}
