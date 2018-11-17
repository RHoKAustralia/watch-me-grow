import * as moment from "moment";
const mailgunJs = require("mailgun-js");
import * as markupJs from "markup-js";
import * as fs from "fs";
import * as _ from "lodash";
import * as functions from "firebase-functions";
import * as firebase from "firebase-admin";

import * as strings from "@wmg/common/src/strings";
import * as questionnaires from "@wmg/common/src/questionnaires";
import * as siteSpecificConfig from "@wmg/common/src/site-specific-config";

const mailgun = mailgunJs({
  apiKey: functions.config().mailgun.apikey,
  domain: "auto.watchmegrow.care"
});

const reminderTemplateBody = fs.readFileSync(
  require.resolve("../../src/reminder-email/Reminder.html"),
  "utf-8"
);

// function questionnaireReminderAges(subsite) {
//   return getQuestionnairesForSubsite(subsite)
//     .filter(questionnaire => questionnaire.remind_at)
//     .map(questionnaire => ({
//       id: questionnaire.id,
//       remindAgeInDays: moment
//         .duration(questionnaire.remind_at, "months")
//         .asDays()
//     }));
// }

type Questionnaire = {
  id: string;
  remind_at: number;
};

type SiteSpecificConfig = {
  [id: string]: {
    questionnaires: string[];
  };
};

const subsitesForQuestionnaire = _(siteSpecificConfig as SiteSpecificConfig)
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

    const questionnaireReminderAges = (questionnaires as Questionnaire[])
      .filter(questionnaire => questionnaire.remind_at)
      .map(questionnaire => ({
        id: questionnaire.id,
        minDate: now
          .clone()
          .subtract(questionnaire.remind_at, "months")
          .subtract(1, "days"),
        maxDate: now.clone().subtract(questionnaire.remind_at, "months")
      }));

    const queries = questionnaireReminderAges
      .filter(
        questionnaireAges => !!subsitesForQuestionnaire[questionnaireAges.id]
      )
      .map(questionnaireAges =>
        firebase
          .firestore()
          .collection("results")
          .where("details.dobOfChild", ">", questionnaireAges.minDate.toDate())
          .where("details.dobOfChild", "<=", questionnaireAges.maxDate.toDate())
          .where(
            "details.subsite",
            "array-contains",
            subsitesForQuestionnaire[questionnaireAges.id]
          )
          .get()
      );

    const querySnapshots = await Promise.all(queries);

    const results = _.flatMap(querySnapshots, snapshot => snapshot.docs);

    const reminderPromises = results.map(result => {
      const details = result.get("details");
      const ageInMonths = moment().diff(moment(details.dobOfChild), "months");

      return sendReminder(details, ageInMonths);
    });

    await Promise.all(reminderPromises);

    console.log(`Successfully reminded ${reminderPromises.length} parents`);
    // mailgun
    //   .lists("reminders@auto.watchmegrow.care")
    //   .members()
    //   .list()
    //   .then(members => {
    //     const children = _.flatMap(members.items, member => {
    //       return Object.keys(member.vars).map(varKey =>
    //         Object.assign(member.vars[varKey], {
    //           name: varKey,
    //           email: member.address,
    //           ageInDays: moment().diff(moment(member.vars[varKey].dob), "days")
    //         })
    //       );
    //     });

    //     const toBeReminded = children.filter(child =>
    //       questionnaireReminderAges(child.subsite).some(
    //         questionnaire =>
    //           !child.completed[questionnaire.id] &&
    //           questionnaire.remindAgeInDays === child.ageInDays
    //       )
    //     );

    //     console.log("Reminding:");
    //     console.log(toBeReminded);

    //     const promises = toBeReminded.map(child =>
    //       sendReminder(
    //         child,
    //         Math.round(moment.duration(child.ageInDays, "days").asMonths())
    //       )
    //     );

    //     return Promise.all(promises);
    //   });

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

  console.log(`Sending reminder to ${child.email}`);

  var params = {
    from: "mail@watchmegrow.care",
    to: child.email,
    subject: "WatchMeGrow.care Reminder for  " + child.name,
    html: message
  };

  return mailgun.messages().send(params);
}
