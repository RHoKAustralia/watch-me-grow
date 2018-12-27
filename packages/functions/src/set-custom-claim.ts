import * as functions from "firebase-functions";
import * as firebaseAdmin from "firebase-admin";

const key = require("../key-dev.json");

firebaseAdmin.initializeApp({
  ...functions.config().firebase,
  credential: firebaseAdmin.credential.cert(key)
});

(async () => {
  try {
    const user = await firebaseAdmin
      .auth()
      .getUserByEmail("alex@alexgilleran.com");
    await firebaseAdmin.auth().setCustomUserClaims(user.uid, {
      admin: true
    });
    console.log("success!");
  } catch (e) {
    console.error(e);
  }
})();
