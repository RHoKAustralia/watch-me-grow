import * as functions from "firebase-functions";
import * as firebaseAdmin from "firebase-admin";

const key =
  functions.config().environment && functions.config().environment.isprod
    ? require("../key-prod.json")
    : require("../key-dev.json");

firebaseAdmin.initializeApp({
  ...functions.config().firebase,
  credential: firebaseAdmin.credential.cert(key)
});

import notifyEmailApp from "./notify-email";
import reminderEmail from "./reminder-email";
import downloadCsv from "./download-csv";

exports.notifyEmail = functions.https.onRequest(notifyEmailApp);
exports.downloadCsv = functions.https.onRequest(downloadCsv);
exports.reminderEmail = functions.pubsub
  .topic("daily-tick")
  .onPublish(reminderEmail);
