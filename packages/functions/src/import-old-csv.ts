import * as functions from "firebase-functions";
import * as firebaseAdmin from "firebase-admin";
import fs from "fs";
import { Transform, Readable } from "stream";
import through2 from "through2";
import csv from "csv-parser";
import moment from "moment";
import _ from "lodash";

import { FirestoreRecord } from "./notify-email";
import questionnaires, { Questionnaire } from "@wmg/common/lib/questionnaires";
import { sites } from "@wmg/common/lib/site-specific-config";

const key = require("../key-prod.json");

const DEFAULT_SITE_ID = "main";

firebaseAdmin.initializeApp({
  ...functions.config().firebase,
  credential: firebaseAdmin.credential.cert(key)
});

// const firestore = firebaseAdmin.firestore();
// const settings = { /* your settings... */ timestampsInSnapshots: true };
// firestore.settings(settings);

const fsReadStream = fs.createReadStream(
  "/home/alex/Downloads/Watch Me Grow - Sheet1.csv"
);

const CSV_DATE_FORMAT = "dddd, MMMM Do YYYY";

function trimSuffixFromId(id: string, questionnaire: Questionnaire): string {
  if (id.endsWith(questionnaire.age_groups.min.toString())) {
    return id.substring(
      0,
      id.length - questionnaire.age_groups.min.toString().length
    );
  } else {
    return id;
  }
}

function sanitiseColumnHeader(header: string) {
  return header.replace(/(\s|_)/g, "").toLowerCase();
}

function ifNotBlank(string: string) {
  return string && string.trim() !== "" ? string : false;
}

function findLocation(locationName: string) {
  if (!locationName) {
    return DEFAULT_SITE_ID;
  }

  const config = sites.find(
    site => site.title.toLowerCase() === locationName.toLowerCase()
  );

  if (config) {
    return config.id;
  } else {
    return DEFAULT_SITE_ID;
  }
}

fsReadStream
  .pipe(csv())
  .pipe(
    through2(
      { objectMode: true },
      (rawResult: { [column: string]: string }, whoKnows, done) => {
        try {
          const result = _.mapKeys(rawResult, (value, resultKey) =>
            sanitiseColumnHeader(resultKey)
          );

          const results = questionnaires
            .map(questionnaire => {
              const answers = questionnaire.questions
                .map(question => {
                  const headerWithHyphen = sanitiseColumnHeader(
                    `${questionnaire.title} - ${trimSuffixFromId(
                      question.id,
                      questionnaire
                    )}`
                  );
                  const headerNoHyphen = sanitiseColumnHeader(
                    `${questionnaire.title} ${trimSuffixFromId(
                      question.id,
                      questionnaire
                    )}`
                  );
                  const headerIdWithHyphen = sanitiseColumnHeader(
                    `${questionnaire.id} - ${trimSuffixFromId(
                      question.id,
                      questionnaire
                    )}`
                  );
                  const headerIdNoHyphen = sanitiseColumnHeader(
                    `${questionnaire.id} ${trimSuffixFromId(
                      question.id,
                      questionnaire
                    )}`
                  );

                  return {
                    id: question.id,
                    answerId:
                      result[headerWithHyphen] ||
                      result[headerNoHyphen] ||
                      result[headerIdWithHyphen] ||
                      result[headerIdNoHyphen]
                  };
                })
                .map(answer => ({
                  ...answer,
                  answerId: answer.answerId && answer.answerId.trim()
                }))
                .filter(answer => answer.answerId && answer.answerId !== "")
                .map(({ id, answerId }) => [id, answerId]);

              return {
                questionnaire: questionnaire.id,
                answers: _.fromPairs(answers)
              };
            })
            .filter(({ answers }) => Object.keys(answers).length > 0);

          const record: FirestoreRecord = {
            results,
            concern: result.concern === "TRUE",
            details: {
              recipientEmail: result[sanitiseColumnHeader("parent email")],
              nameOfParent: result[sanitiseColumnHeader("parent names")],
              firstNameOfChild:
                result[sanitiseColumnHeader("child first name")],
              lastNameOfChild: result[sanitiseColumnHeader("child surname")],
              genderOfChild: result[sanitiseColumnHeader("gender")],
              doctorEmail: result[sanitiseColumnHeader("parent email")],
              dobAsDate: FirebaseFirestore.Timestamp.fromDate(
                moment(
                  result[sanitiseColumnHeader("date of birth")],
                  CSV_DATE_FORMAT
                ).toDate()
              ),
              siteId: findLocation(result.location),
              language: "en"
            },
            date: ifNotBlank(result.date)
              ? moment(result.date).toDate()
              : moment(
                  result[sanitiseColumnHeader("date of testing")],
                  CSV_DATE_FORMAT
                ).toDate()
          };

          if (record.results.length === 0) {
            console.log(result);
            console.log(record);
            throw new Error("Failed to record any results");
          }

          record.results.forEach(recordResult => {
            const relevantQuestionnaire = questionnaires.find(
              questionnaire => questionnaire.id === recordResult.questionnaire
            );

            if (relevantQuestionnaire) {
              if (
                Object.keys(recordResult.answers).length !==
                relevantQuestionnaire.questions.length
              ) {
                console.log(result);
                console.log(JSON.stringify(record, null, 2));
                throw new Error(
                  `Mapped result had the wrong number of answers for ${
                    relevantQuestionnaire.id
                  }`
                );
              }
            } else {
              console.log(record);
              throw new Error(
                `Could not find questionnaire for id ${result.questionnaire}`
              );
            }
          });

          done(null, record);
        } catch (e) {
          done(e);
        }
      }
    )
  )
  .pipe(
    through2(
      { objectMode: true },
      (record: FirestoreRecord, whoKnows, done) => {
        // console.log(record);
        const firestoreCollection = firebaseAdmin
          .firestore()
          .collection("results");

        if (!record.date || record.date.toString() === "Invalid Date") {
          console.warn(
            "Skipping " + record.details.recipientEmail + " as it has no date"
          );
          done();
        } else {
          const query = firestoreCollection
            .where("details.siteId", "==", record.details.siteId)
            .where("date", "==", record.date)
            .where(
              "details.recipientEmail",
              "==",
              record.details.recipientEmail
            )
            .where(
              "details.firstNameOfChild",
              "==",
              record.details.firstNameOfChild
            )
            .where(
              "details.lastNameOfChild",
              "==",
              record.details.lastNameOfChild
            )
            .limit(1);

          (async () => {
            const result = await query.get();

            if (result.docs.length > 0) {
              console.log("Overwriting " + result.docs[0].id);
              await firestoreCollection.doc(result.docs[0].id).update(record);
            } else {
              console.log("Inserting new row");
              await firestoreCollection.add(record);
            }
          })()
            .then(result => done(null, result))
            .catch(err => {
              console.error(record);

              done(err);
            });
        }
        // setTimeout(done, 10);
        // done();

        // return firebase
        //   .firestore()
        //   .collection("/results")
        //   .add(record);
      }
    )
  )
  .on("error", function(err) {
    console.error(err);
  })
  .on("finish", () => {
    console.log("End");
  });

// // Create the parser
// const parser = parse({
//   columns: true
// });
// parser.on("data", async function(...args) {
//   console.log(args);
//   parser.pause();
//   let record;
//   // do {
//   record = parser.read();

//   console.log("waiting");
//   await new Promise(resolve => {
//     setTimeout(resolve, 1000);
//   });
//   console.log("finished waiting");

//   // if (record) {
//   //   console.log("record");
//   // }
//   // } while (record);
//   parser.resume();
// });
