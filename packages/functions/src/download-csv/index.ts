import * as _ from "lodash";
import express from "express";
import * as firebase from "firebase-admin";
import cors from "cors";
import authMiddleware from "../middleware/firebase-auth";

type Input = {
  site: string;
};

const PAGE_SIZE = 25;

const app = express();

app.use(cors());
app.use(authMiddleware);

app.get("*", async (req: express.Request, res: express.Response) => {
  const idToken = (req as any).user as firebase.auth.DecodedIdToken;
  const user = await firebase.auth().getUser(idToken.uid);
  const isAdmin =
    user.customClaims && (user.customClaims as any).admin === true;

  if (!isAdmin) {
    res.status(403).send("User is not an admin");
    console.error("User is not an admin");
    return;
  }

  if (!req.params.sideId) {
    res.status(400).send("No 'siteId' param present");
    return;
  }

  const siteId: string = req.params["siteId"];

  let current = await buildQuery(siteId).get();

  res.write("[");
  current.docs.forEach(doc => res.write(JSON.stringify(doc)));

  while (current.docs.length === PAGE_SIZE) {
    const lastVisible = current.docs[current.docs.length - 1];
    current = await buildQuery(siteId, lastVisible).get();
    if (current.docs.length > 0) {
      res.write(",");
      current.docs.forEach(doc => res.write(JSON.stringify(doc)));
    }
  }

  res.write("]");

  res.status(200).send();
});

function buildQuery(
  siteId: string,
  lastVisible?: FirebaseFirestore.QueryDocumentSnapshot
) {
  const base = firebase
    .firestore()
    .collection("results")
    .where("details.host", "==", siteId)
    .limit(PAGE_SIZE);

  return lastVisible ? base.startAfter(lastVisible) : base;
}

export default app;
