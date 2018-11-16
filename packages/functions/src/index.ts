import * as functions from "firebase-functions";
import * as firebaseAdmin from "firebase-admin";

firebaseAdmin.initializeApp(functions.config().firebase);

import notifyEmailApp from "./notify-email";

exports.notifyEmail = functions.https.onRequest(notifyEmailApp);
