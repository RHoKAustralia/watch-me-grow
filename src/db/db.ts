import pool from "./pool";
import {
  CombinedResult,
  Concerns,
  QuestionAndAnswer
} from "src/common/data-functions";
import {
  NotifyFunctionInputDetails,
  Consent
} from "src/common/notify-function-input";
import { DatabaseTransactionConnectionType, sql } from "slonik";
import _ from "lodash";
import { Questionnaire } from "src/common/questionnaires";

export function recordResult(
  results: CombinedResult[],
  concerns: Concerns,
  details: NotifyFunctionInputDetails,
  consent: Consent
): Promise<number> {
  return pool.transaction(async connection => {
    const guardianId: number = (await insertGuardian(
      connection,
      details
    )) as number;

    const childId: number = (await insertChild(
      connection,
      details,
      guardianId
    )) as number;

    const resultId: number = (await insertResult(
      connection,
      details,
      guardianId,
      childId
    )) as number;

    for (let concernKey of Object.keys(concerns)) {
      if (concerns[concernKey]) {
        await insertResultConcern(connection, resultId, concernKey);
      }
    }

    const resultConcernPromises = _(concerns)
      .map((value, key) => ({ value, key }))
      .filter(({ value, key }) => value)
      .map(({ value, key }) => insertResultConcern(connection, resultId, key))
      .value();

    const answerPromises = _(results)
      .flatMap(({ questionnaire, results }) =>
        results.map(result => ({ questionnaire, result }))
      )
      .map(({ questionnaire, result }) =>
        insertResultAnswer(connection, questionnaire, result, resultId)
      )
      .value();

    const consentPromise = insertConsent(connection, consent, resultId);

    await Promise.all([
      ...resultConcernPromises,
      ...answerPromises,
      consentPromise
    ]);

    return resultId;
  });
}

async function insertGuardian(
  connection: DatabaseTransactionConnectionType,
  details: NotifyFunctionInputDetails
) {
  return connection.oneFirst(sql`
    INSERT INTO guardians (name, email_address)
      VALUES (${details.nameOfParent}, ${details.recipientEmail})
      RETURNING guardian_id;
    `);
}

function insertChild(
  connection: DatabaseTransactionConnectionType,
  details: NotifyFunctionInputDetails,
  guardianId: number
) {
  return connection.oneFirst(sql`
    INSERT INTO children (dob, given_name, surname, gender_id, guardian_id)
      VALUES (${details.dobOfChild}, ${details.firstNameOfChild}, ${details.lastNameOfChild}, ${details.genderOfChild}, ${guardianId})
      RETURNING child_id;
    `);
}

function insertResult(
  connection: DatabaseTransactionConnectionType,
  details: NotifyFunctionInputDetails,
  guardianId: number,
  childId: number
) {
  return connection.oneFirst(sql`
    INSERT INTO results (date, language_id, site_id, guardian_id, child_id)
      VALUES (${details.testDate}, ${details.language}, ${details.siteId}, ${guardianId}, ${childId})
      RETURNING result_id
    `);
}

function insertResultConcern(
  connection: DatabaseTransactionConnectionType,
  resultId: number,
  concernId: string
) {
  return connection.query(sql`
    INSERT INTO result_concerns (result_id, concern_id)
      VALUES (${resultId}, ${concernId})
    `);
}

function insertResultAnswer(
  connection: DatabaseTransactionConnectionType,
  questionnaire: Questionnaire,
  questionAndAnswer: QuestionAndAnswer,
  resultId: number
) {
  return connection.query(sql`
    INSERT INTO result_answers (question_id, questionnaire_id, answer_id, result_id)
      VALUES (${questionAndAnswer.question.id}, ${questionnaire.id}, ${questionAndAnswer.answer.metadata.value}, ${resultId});
    `);
}

function insertConsent(
  connection: DatabaseTransactionConnectionType,
  consent: Consent,
  resultId: number
) {
  return connection.query(sql`
    INSERT INTO consent (
      info_id,
      receive_copy,
      understand_consent,
      info_sheet,
      understand_aim,
      opportunity_to_ask,
      agree_to_participate,
      result_id
    ) VALUES (
      ${consent.info ? consent.info.toString() : null},
      ${consent.receiveCopy},
      ${consent.understandConsent},
      ${consent.infoSheet},
      ${consent.understandAim},
      ${consent.opportunityToAsk},
      ${consent.agreeToParticipate},
      ${resultId}
    );
  `);
}
