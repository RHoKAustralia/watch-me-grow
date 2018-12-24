import * as functions from "firebase-functions";
import * as firebaseAdmin from "firebase-admin";

firebaseAdmin.initializeApp(functions.config().firebase);

firebaseAdmin.firestore().settings({
  timestampsInSnapshots: true
});

import notifyEmailApp from "./notify-email";
import reminderEmail from "./reminder-email";
import downloadCsv from "./download-csv";

exports.notifyEmail = functions.https.onRequest(notifyEmailApp);
exports.downloadCsv = functions.https.onRequest(downloadCsv);
exports.reminderEmail = functions.pubsub
  .topic("daily-tick")
  .onPublish(reminderEmail);
