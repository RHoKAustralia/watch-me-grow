import * as functions from "firebase-functions";
import * as firebaseAdmin from "firebase-admin";

firebaseAdmin.initializeApp(functions.config().firebase);

firebaseAdmin.firestore().settings({
  timestampsInSnapshots: true
});

import notifyEmailApp from "./notify-email";
import reminderEmail from "./reminder-email";

exports.notifyEmail = functions.https.onRequest(notifyEmailApp);
exports.reminderEmail = functions.pubsub
  .topic("daily-tick")
  .onPublish(reminderEmail);
