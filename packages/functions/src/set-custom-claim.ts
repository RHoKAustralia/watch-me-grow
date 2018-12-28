import * as functions from "firebase-functions";
import * as firebaseAdmin from "firebase-admin";

const key = require("../key-dev.json");

firebaseAdmin.initializeApp({
  ...functions.config().firebase,
  credential: firebaseAdmin.credential.cert(key)
});

firebaseAdmin
  .auth()
  .getUserByEmail("mail@watchmegrow.care")
  .then(user =>
    firebaseAdmin.auth().setCustomUserClaims(user.uid, {
      admin: true
    })
  )
  .then(() => {
    console.log("success!");
    process.exit(0);
  })
  .catch(e => {
    console.error(e);
  });
