// process.setMaxListeners(20);
process.on("uncaughtException", console.error);
process.on("warning", e => console.warn(e.stack));
import events from "events";
const EventEmitter = events.EventEmitter;
EventEmitter.defaultMaxListeners = 100;
import { NextApiRequest, NextApiResponse } from "next";
import moment from "moment";
import * as fs from "fs";
import groupBy from "lodash/groupBy";

// @ts-ignore
import * as markupJs from "markup-js";
import i18next from "i18next";
import config from "config";
import path from "path";
import { recordResult } from "../../db/db";

import questionnairesForSubsite from "src/common/questionnaires-for-subsite";
import {
  mark,
  combineAll,
  CombinedResult,
  anyConcerns,
  Concerns
} from "src/common/data-functions";
import minMax from "src/common/min-max";
import {
  NotifyFunctionInput,
  NotifyFunctionInputDetails
} from "src/common/notify-function-input";
import ageInMonthsToString from "src/common/age-to-string";
import buildi18n from "../i18n";
import categoryToLink from "src/common/category-to-link";
import mailgun, { EMAIL_FROM } from "src/api/mailgun";

type EmailResult = {
  questionnaire: {
    title: string;
  };
  results: {
    questionText: string;
    answer: {
      answerText: string;
      comments?: string;
      concern: boolean;
    };
  }[];
};

type ParentEmailInput = {
  details: {
    nameOfParent: string;
    firstNameOfChild: string;
    lastNameOfChild: string;
    testDateFormatted: string;
    dobChildFormatted: string;
    ageOfChild: string;
    testId: string;
  };
  results: {
    heading: string;
    resultText: string;
    subcategories: {
      subcategoryHeading?: string;
      questionnaires: EmailResult[];
    }[];
  }[];
};

type DoctorEmailInput = ParentEmailInput & {
  minAge: string;
  maxAge: string;
  anyConcerns: boolean;
};

const FORMAT = "dddd, MMMM Do YYYY";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }
  try {
    const body = req.body as NotifyFunctionInput;
    const details = body.details;

    if (!details.recipientEmail) {
      res.status(500).send("Error: Missing parameter.");
      console.error("Missing parameter");
      throw new Error("Missing parameter");
    }

    const t = await buildi18n(body.details.language);

    const combinedResults = combineAll(body.results, t);
    const concerns = mark(combinedResults);

    const detailsWithDates = {
      ...details,
      testDateFormatted: moment(details.testDate).format(FORMAT),
      dobChildFormatted: moment(details.dobOfChild).format(FORMAT)
    };

    // const firestoreResult = await recordResultsInFirestore(
    //   combinedResults,
    //   concerns,
    //   details,
    //   body.consent
    // );

    const resultId = await recordResult(
      combinedResults,
      concerns,
      details,
      body.consent
    );

    const parentEmailPromise = sendParentEmail(
      detailsWithDates,
      combinedResults,
      concerns,
      t,
      resultId.toString()
    );

    const promises = details.doctorEmail
      ? [
          parentEmailPromise,
          sendDoctorEmail(
            detailsWithDates,
            combinedResults,
            concerns,
            t,
            resultId.toString()
          )
        ]
      : [parentEmailPromise];

    await Promise.all(promises);

    res.status(200).json({ status: "OK" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ status: "Not OK" });
  }
};

const templateBody = fs.readFileSync(
  path.join(path.dirname(require.resolve("./index")), "Results.html"),
  "utf-8"
);

function sendParentEmail(
  details: NotifyFunctionInputDetails,
  combinedResults: CombinedResult[],
  concerns: { [category: string]: boolean },
  t: i18next.TFunction,
  id: string
) {
  const templateInput: ParentEmailInput = buildEmailInput(
    details,
    combinedResults,
    concerns,
    t,
    id
  );

  const message = markupJs.up(
    templateBody,
    {
      ...templateInput
    },
    {
      globals: { t: { t } }
    }
  );

  const params = addCCToParams({
    from: EMAIL_FROM,
    to: details.recipientEmail,
    subject: `${t("emails.results.subject")} ${details.firstNameOfChild}`,
    html: message
  });

  return mailgun.messages().send(params);
}

function addCCToParams(params: any) {
  const newParams = { ...params };
  if (config.has("notifyEmail.cc")) {
    newParams.cc = config.get("notifyEmail.cc");
  }
  return newParams;
}

const subcategoryHeadingLookup: { [subcategory: string]: string } = {
  development: "emails.results.developmentHeading",
  communication: "emails.results.socialHeading"
};

function buildEmailInput(
  details: NotifyFunctionInputDetails,
  combinedResults: CombinedResult[],
  concerns: { [key: string]: boolean },
  t: i18next.TFunction,
  id: string
): DoctorEmailInput {
  const { minMonths, maxMonths } = minMax(
    questionnairesForSubsite(details.siteId)
  );

  const groupedByCategory = groupBy(
    combinedResults,
    (result: CombinedResult) => result.questionnaire.category
  );

  const results = Object.keys(groupedByCategory).map(category => {
    const prefix = `results.${category}`;
    const concern = concerns[category];
    const groupedBySubcategory = groupBy(
      groupedByCategory[category],
      result => result.questionnaire.subcategory
    );

    const links = categoryToLink[category];

    return {
      heading: `${prefix}.heading.parent`,
      headingDoctor: `${prefix}.heading.doctor`,
      resultText: `${prefix}.${concern ? "concern" : "noConcern"}.parent`,
      resultTextDoctor: `${prefix}.${concern ? "concern" : "noConcern"}.doctor`,
      links,
      subcategories: Object.keys(groupedBySubcategory).map(subcategory => {
        return {
          subcategoryHeading: subcategoryHeadingLookup[subcategory] as
            | string
            | undefined,
          questionnaires: groupedBySubcategory[subcategory]
        };
      })
    };
  });

  return {
    details: {
      nameOfParent: details.nameOfParent,
      firstNameOfChild: details.firstNameOfChild,
      lastNameOfChild: details.lastNameOfChild,
      testDateFormatted: moment(details.testDate).format(FORMAT),
      dobChildFormatted: moment(details.dobOfChild).format(FORMAT),
      ageOfChild: ageInMonthsToString(
        moment().diff(moment(details.dobOfChild), "months"),
        t
      ),
      testId: id
    },
    results,
    minAge: ageInMonthsToString(minMonths, t),
    maxAge: ageInMonthsToString(maxMonths, t),
    anyConcerns: anyConcerns(concerns)
  };
}

const doctorTemplateBody = fs.readFileSync(
  path.join(path.dirname(require.resolve("./index")), "Doctor.html"),
  "utf-8"
);

function sendDoctorEmail(
  details: NotifyFunctionInputDetails,
  combinedResults: CombinedResult[],
  concerns: Concerns,
  t: i18next.TFunction,
  id: string
) {
  const doctorEmailInput: DoctorEmailInput = buildEmailInput(
    details,
    combinedResults,
    concerns,
    t,
    id
  );

  const message = markupJs.up(
    doctorTemplateBody,
    {
      ...doctorEmailInput
    },
    {
      globals: { t: { t } }
    }
  );

  const params = addCCToParams({
    from: EMAIL_FROM,
    to: details.doctorEmail,
    subject: `${t("emails.doctor.subject")} ${details.firstNameOfChild}`,
    html: message
  });

  return mailgun.messages().send(params);
}
