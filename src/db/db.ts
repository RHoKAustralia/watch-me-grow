import pool from "./pool";
import {
  CombinedResult,
  Concerns,
  QuestionAndAnswer
} from "src/common/data-functions";
import {
  NotifyFunctionInputDetails,
  Consent,
  NotifyFunctionInput,
  ConsentInfo,
  NotifyFunctionResults
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

export async function getResults(
  siteId: string,
  after: number,
  pageSize: number
): Promise<NotifyFunctionInput[]> {
  return pool.connect(async connection => {
    const metadataRows = await connection.any(sql`
    SELECT
      results.result_id, results.date, results.language_id, results.site_id,
      children.dob, children.given_name, children.surname, children.gender_id,
      consents.info_id, consents.receive_copy, consents.understand_consent,
        consents.info_sheet, consents.understand_aim, consents.opportunity_to_ask,
        consents.agree_to_participate,
      guardians.name, guardians.email_address
    FROM results, guardians, children, consents
    WHERE
      results.site_id = ${siteId} AND
      results.guardian_id = guardians.guardian_id AND
      results.child_id = children.child_id AND
      consents.result_id = results.result_id
    ORDER BY results.date
    LIMIT ${pageSize}
    OFFSET ${after}
  `);

    console.log(metadataRows);

    let allResults: NotifyFunctionInput[] = [];
    for (let row of metadataRows) {
      const resultRows = await connection.many(sql`
        SELECT question_id, questionnaire_id, answer_id
        FROM result_answers
        WHERE result_answers.result_id = ${row.result_id}
      `);

      const results: NotifyFunctionResults = _(resultRows)
        .groupBy("questionnaire_id")
        .mapValues(rows =>
          _(rows)
            .keyBy("question_id")
            .mapValues(row => ({
              value: row.answer_id as string,
              comments: row.comments as string
            }))
            .value()
        )
        .value();

      const details: NotifyFunctionInputDetails = {
        recipientEmail: row.email_address as string,
        testDate: row.date as string,
        nameOfParent: row.name as string,
        firstNameOfChild: row.given_name as string,
        lastNameOfChild: row.surname as string,
        genderOfChild: row.gender_id as string,
        dobOfChild: row.dob as string,
        doctorEmail: row.doctor_email as string,
        siteId: row.site_id as string,
        language: row.language_id as string
      };

      const consent: Consent = {
        info: row.info_id as ConsentInfo,
        receiveCopy: (row.receive_copy as any) as boolean,
        understandConsent: (row.understand_consent as any) as boolean,
        infoSheet: (row.info_sheet as any) as boolean,
        understandAim: (row.understand_aim as any) as boolean,
        opportunityToAsk: (row.opportunity_to_ask as any) as boolean,
        agreeToParticipate: (row.agree_to_participate as any) as boolean
      };

      allResults.push({
        details,
        results,
        consent
      });
    }

    return allResults;
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
    INSERT INTO results (date, doctor_email, language_id, site_id, guardian_id, child_id)
      VALUES (${details.testDate}, ${details.doctorEmail || null}, ${
    details.language
  }, ${details.siteId}, ${guardianId}, ${childId})
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
    INSERT INTO result_answers (question_id, questionnaire_id, answer_id, result_id, comments)
      VALUES (${questionAndAnswer.question.id}, ${questionnaire.id}, 
        ${
          questionAndAnswer.answer.metadata.value
        }, ${resultId}, ${questionAndAnswer.answer.rawAnswer.comments || null});
    `);
}

function insertConsent(
  connection: DatabaseTransactionConnectionType,
  consent: Consent,
  resultId: number
) {
  return connection.query(sql`
    INSERT INTO consents (
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
