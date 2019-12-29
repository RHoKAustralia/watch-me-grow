import _ from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import auth from "basic-auth";
import compare from "tsscmp";

const createCsvStringifier = require("csv-writer").createObjectCsvStringifier;

import questionnairesForSubsite from "src/common/questionnaires-for-subsite";
import {
  NotifyFunctionInputDetails,
  Consent,
  NotifyFunctionInput
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
    const credentials = auth(req);

    if (!credentials || !check(credentials.name, credentials.pass)) {
      res.statusCode = 401;
      res.setHeader("WWW-Authenticate", 'Basic realm="watchmegrow.care"');
      console.error(
        "Denied access" + (!!credentials ? ` for ${credentials.name}` : "")
      );
      res.end("Access denied");
      return;
    }

    if (!req.query.siteId) {
      res.status(400).send("No 'siteId' param present");
      return;
    }

    const siteId: string = req.query.siteId as string;

    let offset = 0;
    let current = await getResults(siteId, offset, PAGE_SIZE);

    res.setHeader("type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + req.query.siteId + ".csv"
    );

    const detailsHeaders = Object.keys(dummyDetails);
    const consentHeaders = Object.keys(dummyConsent);
    const questionnaires = questionnairesForSubsite(req.query.siteId as string);
    const questionIds = _.flatMap(questionnaires, questionnaire =>
      _.flatMap(questionnaire.questions, question =>
        buildHeaderId(questionnaire, question)
      )
    );

    const headers = [...consentHeaders, ...detailsHeaders, ...questionIds];

    const csvStringifier = createCsvStringifier({
      header: headers.map(header => ({ id: header, title: header }))
    });

    res.write(csvStringifier.getHeaderString());
    res.write(
      csvStringifier.stringifyRecords(
        current.map(fnInput => flattenResultDoc(fnInput))
      )
    );

    while (current.length === PAGE_SIZE) {
      offset += current.length;
      current = await getResults(siteId, offset, PAGE_SIZE);
      if (current.length > 0) {
        res.write(
          csvStringifier.stringifyRecords(
            current.map(fnInput => flattenResultDoc(fnInput))
          )
        );
      }
    }

    res.status(200).end();
  } catch (e) {
    console.error(e);
    res.status(500).send("Error");
  }
};

function check(name: string, pass: string) {
  if (process.env.WMG_PASSWORD) {
    var valid = true;
    // Simple method to prevent short-circut and use timing-safe compare
    valid = compare(name, "admin") && valid;
    valid = compare(pass, process.env.WMG_PASSWORD) && valid;
    return valid;
  } else {
    console.error(
      `process.env.WMG_PASSWORD was not set, all auth'd requests will be denied`
    );
    return false;
  }
}

function buildHeaderId(questionnaire: Questionnaire, question: Question) {
  let headerIds = [`${questionnaire.id}:${question.id}:answer`];

  if (question.comments) {
    headerIds.push(`${questionnaire.id}:${question.id}:comments`);
  }

  return headerIds;
}

function flattenResultDoc(doc: NotifyFunctionInput) {
  const flattenedAnswers = _(doc.results)
    .mapValues((result, questionnaireId) =>
      _(result)
        .mapValues((answer, questionId) => {
          const flattenedAnswer = {
            [`${questionnaireId}:${questionId}:answer`]: answer.value
          };

          return answer.comments
            ? {
                ...flattenedAnswer,
                [`${questionnaireId}:${questionId}:comments`]: answer.comments
              }
            : flattenedAnswer;
        })
        .values()
        .value()
    )
    .values()
    .flattenDeep()
    .reduce((accumulator, current) => ({
      ...accumulator,
      ...current
    }));

  return {
    ...doc.consent,
    ...doc.details,
    ...flattenedAnswers,
    ...doc.consent
  };
}
