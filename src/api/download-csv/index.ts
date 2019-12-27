import flatMap from "lodash/flatMap";
import fromPairs from "lodash/fromPairs";
import { NextApiRequest, NextApiResponse } from "next";

const createCsvStringifier = require("csv-writer").createObjectCsvStringifier;

import questionnairesForSubsite from "src/common/questionnaires-for-subsite";
import {
  NotifyFunctionInputDetails,
  Consent
} from "src/common/notify-function-input";
import { Questionnaire, Question } from "src/common/questionnaires";
import { getResults } from "src/db/db";

type Input = {
  site: string;
};

const PAGE_SIZE = 25;

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
const dummyConsent: Consent = {
  info: "studyOnly",
  receiveCopy: false,
  understandConsent: false,
  infoSheet: false,
  understandAim: false,
  opportunityToAsk: false,
  agreeToParticipate: false
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const isAdmin = true;

    if (!isAdmin) {
      res.status(403).send("User is not an admin");
      console.error("User is not an admin");
      return;
    }

    if (!req.query.siteId) {
      res.status(400).send("No 'siteId' param present");
      return;
    }

    const siteId: string = req.query.siteId as string;

    let current = await getResults(siteId, 0, PAGE_SIZE);

    if (req.query.format === "json") {
      //   res.setHeader("type", "application/json");
      //   res.write("[");
      //   res.write(
      //     current
      //       .map(doc =>
      //         JSON.stringify(flattenResultDoc(doc.data() as FirestoreRecord))
      //       )
      //       .join(",")
      //   );

      //   while (current.docs.length === PAGE_SIZE) {
      //     const lastVisible = current.docs[current.docs.length - 1];
      //     current = await buildQuery(siteId, lastVisible).get();
      //     if (current.docs.length > 0) {
      //       current.docs.forEach(doc => {
      //         res.write(",");
      //         res.write(
      //           JSON.stringify(flattenResultDoc(doc.data() as FirestoreRecord))
      //         );
      //       });
      //     }
      //   }

      res.write("]");
    } else {
      res.setHeader("type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + req.query.siteId + ".csv"
      );

      const detailsHeaders = Object.keys(dummyDetails);
      const consentHeaders = Object.keys(dummyConsent);
      const questionnaires = questionnairesForSubsite(
        req.query.siteId as string
      );
      const questionIds = flatMap(questionnaires, questionnaire =>
        questionnaire.questions.map(question =>
          buildHeaderId(questionnaire, question)
        )
      );

      const headers = [...consentHeaders, ...detailsHeaders, ...questionIds];

      const csvStringifier = createCsvStringifier({
        header: headers.map(header => ({ id: header, title: header }))
      });

      res.write(csvStringifier.getHeaderString());

      //   res.write(
      //     csvStringifier.stringifyRecords(
      //       current.docs.map(doc =>
      //         flattenResultDoc(doc.data() as FirestoreRecord)
      //       )
      //     )
      //   );

      //   while (current.docs.length === PAGE_SIZE) {
      //     const lastVisible = current.docs[current.docs.length - 1];
      //     current = await buildQuery(siteId, lastVisible).get();
      //     if (current.docs.length > 0) {
      //       res.write(
      //         csvStringifier.stringifyRecords(
      //           current.docs.map(doc =>
      //             flattenResultDoc(doc.data() as FirestoreRecord)
      //           )
      //         )
      //       );
      //     }
      //   }
    }

    res.status(200).end();
  } catch (e) {
    console.error(e);
    res.status(500).send("Error");
  }
};

function buildHeaderId(questionnaire: Questionnaire, question: Question) {
  return questionnaire.id + ":" + question.id;
}

// function buildQuery(
//   siteId: string,
//   lastVisible?: FirebaseFirestore.QueryDocumentSnapshot
// ) {
//   const base = firebase
//     .firestore()
//     .collection("results")
//     .where("details.siteId", "==", siteId)
//     .orderBy("date")
//     .limit(PAGE_SIZE);

//   return lastVisible ? base.startAfter(lastVisible) : base;
// }

function flattenResultDoc(doc: NotifyFunctionInputDetails) {
  //   const results = fromPairs(
  //     flatMap(doc.results, result =>
  //       Object.keys(result.answers).map(answerId => [
  //         result.questionnaire + ":" + answerId,
  //         result.answers[answerId]
  //       ])
  //     )
  //   );

  return {
    // ...doc.consent,
    // ...doc.details,
    // dobOfChild: doc.details.dobAsDate.toDate().toDateString(),
    // testDate: doc.date.toDate().toDateString(),
    // ...results,
    // ...doc.consent
  };
}
