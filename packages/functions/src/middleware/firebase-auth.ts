import firebase from "firebase-admin";
import CookieParser from "cookie-parser";

const cookieParser = CookieParser();

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const validateFirebaseIdToken = (req, res, next) => {
  cookieParser(req, res, () => {
    if (
      (!req.headers.authorization ||
        !req.headers.authorization.startsWith("Bearer ")) &&
      !(req.cookies && req.cookies.__session)
    ) {
      console.error(
        "No Firebase ID token was passed as a Bearer token in the Authorization header.",
        "Make sure you authorize your request by providing the following HTTP header:",
        "Authorization: Bearer <Firebase ID Token>",
        'or by passing a "__session" cookie.'
      );
      res.status(403).send("Unauthorized");
      return;
    }

    let idToken;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      // Read the ID Token from the Authorization header.
      idToken = req.headers.authorization.split("Bearer ")[1];
    } else if (req.cookies) {
      // Read the ID Token from cookie.
      idToken = req.cookies.__session;
    } else {
      // No cookie
      res.status(403).send("Unauthorized");
      return;
    }

    firebase
      .auth()
      .verifyIdToken(idToken)
      .then(decodedIdToken => {
        req.user = decodedIdToken;
        return next();
      })
      .catch(error => {
        console.error("Error while verifying Firebase ID token:", error);
        res.status(403).send("Unauthorized");
      });
  });
};

export default validateFirebaseIdToken;
