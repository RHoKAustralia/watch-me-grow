import express from "express";
import * as firebase from "firebase-admin";
import cors from "cors";
import flatMap from "lodash/flatMap";
import fromPairs from "lodash/fromPairs";
const createCsvStringifier = require("csv-writer").createObjectCsvStringifier;

import authMiddleware from "../middleware/firebase-auth";
import questionnairesForSubsite from "@wmg/common/lib/questionnaires-for-subsite";
import { NotifyFunctionInputDetails } from "@wmg/common/lib/notify-function-input";
import { FirestoreRecord } from "../notify-email";
import { Questionnaire, Question } from "@wmg/common/lib/questionnaires";

type Input = {
  site: string;
};

const PAGE_SIZE = 25;

const app = express();

app.use(cors());
app.use(authMiddleware);

/**
 * Used purely for getting the right headers for the CSV file in such a way that it'll
 * break if the type def changes
 */
const dummyDetails: NotifyFunctionInputDetails = {
  recipientEmail: "",
  testDate: "",
  nameOfParent: "",
  firstNameOfChild: "",
  lastNameOfChild: "",
  genderOfChild: "",
  dobOfChild: "",
  doctorEmail: "",
  ageInMonths: 0,
  siteId: "",
  language: ""
};

app.get("*", async (req: express.Request, res: express.Response) => {
  try {
    const idToken = (req as any).user as firebase.auth.DecodedIdToken;
    const user = await firebase.auth().getUser(idToken.uid);
    const isAdmin =
      user.customClaims && (user.customClaims as any).admin === true;

    if (!isAdmin) {
      res.status(403).send("User is not an admin");
      console.error("User is not an admin");
      return;
    }

    if (!req.query.siteId) {
      res.status(400).send("No 'siteId' param present");
      return;
    }

    const siteId: string = req.query.siteId;

    let current = await buildQuery(siteId).get();

    if (req.query.format === "json") {
      res.type("application/json");
      res.write("[");
      res.write(
        current.docs
          .map(doc =>
            JSON.stringify(flattenResultDoc(doc.data() as FirestoreRecord))
          )
          .join(",")
      );

      while (current.docs.length === PAGE_SIZE) {
        const lastVisible = current.docs[current.docs.length - 1];
        current = await buildQuery(siteId, lastVisible).get();
        if (current.docs.length > 0) {
          current.docs.forEach(doc => {
            res.write(",");
            res.write(
              JSON.stringify(flattenResultDoc(doc.data() as FirestoreRecord))
            );
          });
        }
      }

      res.write("]");
    } else {
      res.type("text/csv");
      res.header(
        "Content-Disposition",
        "attachment; filename=" + req.query.siteId + ".csv"
      );

      const detailsHeaders = Object.keys(dummyDetails);
      const questionnaires = questionnairesForSubsite(req.query.siteId);
      const questionIds = flatMap(questionnaires, questionnaire =>
        questionnaire.questions.map(question =>
          buildHeaderId(questionnaire, question)
        )
      );

      const headers = [...detailsHeaders, ...questionIds];

      const csvStringifier = createCsvStringifier({
        header: headers.map(header => ({ id: header, title: header }))
      });

      res.write(csvStringifier.getHeaderString());

      res.write(
        csvStringifier.stringifyRecords(
          current.docs.map(doc =>
            flattenResultDoc(doc.data() as FirestoreRecord)
          )
        )
      );

      while (current.docs.length === PAGE_SIZE) {
        const lastVisible = current.docs[current.docs.length - 1];
        current = await buildQuery(siteId, lastVisible).get();
        if (current.docs.length > 0) {
          res.write(
            csvStringifier.stringifyRecords(
              current.docs.map(doc =>
                flattenResultDoc(doc.data() as FirestoreRecord)
              )
            )
          );
        }
      }
    }

    res.status(200).send();
  } catch (e) {
    console.error(e);
    res.status(500).send("Error");
  }
});

function buildHeaderId(questionnaire: Questionnaire, question: Question) {
  return questionnaire.id + ":" + question.id;
}

function flattenResultDoc(doc: FirestoreRecord) {
  const results = fromPairs(
    flatMap(doc.results, result =>
      Object.keys(result.answers).map(answerId => [
        result.questionnaire + ":" + answerId,
        result.answers[answerId]
      ])
    )
  );

  return {
    ...doc.details,
    dobAsDate: undefined,
    date: undefined,
    ...results
  };
}

function buildQuery(
  siteId: string,
  lastVisible?: FirebaseFirestore.QueryDocumentSnapshot
) {
  const base = firebase
    .firestore()
    .collection("results")
    .where("details.siteId", "==", siteId)
    .limit(PAGE_SIZE);

  return lastVisible ? base.startAfter(lastVisible) : base;
}

export default app;
