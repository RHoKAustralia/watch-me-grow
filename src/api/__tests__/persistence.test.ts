import http, { IncomingMessage, ServerResponse } from "http";
import fetch from "isomorphic-unfetch";
import listen from "test-listen";
import { apiResolver } from "next-server/dist/server/api-utils";
import parse from "csv-parse/lib/sync";

import { buildDefaultPayload } from "./fixtures";
import _ from "lodash";

import { testResultHarness } from "./test-harness";

import handler from "pages/api/download-csv";
import { NotifyFunctionInput } from "src/common/notify-function-input";
import questionnaires from "src/common/questionnaires";
import { sites } from "src/common/site-specific-config";
import getQuestionnairesForSubsite from "src/common/questionnaires-for-subsite";
const CSV_REQUEST_HANDLER = (req: any, res: any) =>
  apiResolver(req, res, undefined, handler);

const PASSWORD = "secret";

testResultHarness(({ setupDb, teardownDb, setupMailgun, url: resultUrl }) => {
  describe("persistence", () => {
    let server: http.Server;
    let csvUrl: string;

    beforeAll(() => {
      process.env.WMG_PASSWORD = PASSWORD;
    });

    afterAll(() => {
      delete process.env.WMG_PASSWORD;
    });

    beforeEach(async () => {
      await setupDb();
      server = http.createServer(CSV_REQUEST_HANDLER);
      csvUrl = await listen(server);
    });

    afterEach(async () => {
      await teardownDb();
      await new Promise((res, rej) => {
        server.close(err => {
          if (err) {
            rej(err);
          } else {
            res();
          }
        });
      });
    });

    const getCsv = (siteId: string) => {
      return fetch(`${csvUrl}?siteId=${siteId}`, {
        method: "GET",
        headers: {
          Authorization: `Basic ${Buffer.from(
            "admin" + ":" + "secret"
          ).toString("base64")}`
        }
      });
    };

    describe("csv", () => {
      let csvObj: any;
      let payload: NotifyFunctionInput;

      it("outputs the correct headers for each site", async () => {
        expect(sites.length).toBeGreaterThan(0);

        for (let site of sites) {
          let csvResponse = await getCsv(site.id);
          expect(csvResponse.status).toBe(200);

          const csvText = await csvResponse.text();

          const headerLookup = _(csvText.split(","))
            .keyBy(value => value.trim())
            .mapValues(() => true)
            .value();

          const headers = Object.keys(headerLookup);
          expect(headers.length).toBeGreaterThan(0);

          const questionnairesForSubsite = getQuestionnairesForSubsite(site.id);
          expect(questionnairesForSubsite.length).toBeGreaterThan(0);

          for (let questionnaire of questionnairesForSubsite) {
            expect(questionnaire.questions.length).toBeGreaterThan(0);

            for (let question of questionnaire.questions) {
              const answerColumnHeader = `${questionnaire.id}:${question.id}:answer`;

              expect(
                headerLookup[answerColumnHeader],
                answerColumnHeader
              ).toEqual(true);

              if (question.comments) {
                expect(
                  headerLookup[`${questionnaire.id}:${question.id}:comments`]
                ).toEqual(true);
              }
            }
          }

          const questionnairesNotForSubsite = _.differenceWith(
            questionnaires,
            questionnairesForSubsite,
            (x, y) => x.id === y.id
          );

          expect(questionnairesNotForSubsite.length).toBeGreaterThan(0);

          for (let notForSubsiteQuestionnaire of questionnairesNotForSubsite) {
            expect(
              headers.some(header =>
                header.startsWith(notForSubsiteQuestionnaire.id)
              ),
              `${JSON.stringify(
                headers
              )} should not have contained questionnaire id ${
                notForSubsiteQuestionnaire.id
              }`
            ).toEqual(false);
          }
        }
      });

      describe("authentication", () => {
        it("rejects when there's no auth header", async () => {
          const res = await fetch(`${csvUrl}?siteId=main`, {
            method: "GET"
          });

          expect(res.status).toBe(401);
        });

        it("rejects when the password is wrong", async () => {
          const res = await fetch(`${csvUrl}?siteId=main`, {
            method: "GET",
            headers: {
              Authorization: `Basic ${Buffer.from(
                "admin" + ":" + PASSWORD + "blah"
              ).toString("base64")}`
            }
          });

          expect(res.status).toBe(401);
        });

        it("rejects when the username is wrong", async () => {
          const res = await fetch(`${csvUrl}?siteId=main`, {
            method: "GET",
            headers: {
              Authorization: `Basic ${Buffer.from(
                "blah" + ":" + PASSWORD
              ).toString("base64")}`
            }
          });

          expect(res.status).toBe(401);
        });

        it("rejects when the username and password are wrong", async () => {
          const res = await fetch(`${csvUrl}?siteId=main`, {
            method: "GET",
            headers: {
              Authorization: `Basic ${Buffer.from(
                "blah" + ":" + PASSWORD + "blah"
              ).toString("base64")}`
            }
          });

          expect(res.status).toBe(401);
        });
      });

      it("filters by site correctly", async () => {
        // We're going to submit twice, so we need two sets of mailgun expectations.
        setupMailgun();
        setupMailgun();

        const payloadMain = buildDefaultPayload();
        const payloadDevelopmental = buildDefaultPayload();
        payloadDevelopmental.details.siteId = "developmental";
        payloadDevelopmental.details.firstNameOfChild = "Devin";

        let mainResponse = await fetch(resultUrl(), {
          method: "POST",
          body: JSON.stringify(payloadMain),
          headers: {
            "Content-Type": "application/json"
          }
        });
        expect(mainResponse.status).toBe(200);

        let developmentalResponse = await fetch(resultUrl(), {
          method: "POST",
          body: JSON.stringify(payloadDevelopmental),
          headers: {
            "Content-Type": "application/json"
          }
        });
        expect(developmentalResponse.status).toBe(200);

        let csvResponseMain = await getCsv("main");
        expect(csvResponseMain.status).toBe(200);
        const csvTextMain = await csvResponseMain.text();
        const csvObjMain = parse(csvTextMain, { columns: true });

        let csvResponseDevelopmental = await getCsv("developmental");
        expect(csvResponseDevelopmental.status).toBe(200);
        const csvTextDevelopmental = await csvResponseDevelopmental.text();
        const csvObjDevelopmental = parse(csvTextDevelopmental, {
          columns: true
        });

        expect(csvObjMain.length).toEqual(1);
        expect(csvObjDevelopmental.length).toEqual(1);

        expect(csvObjMain[0].firstNameOfChild).toEqual(
          payloadMain.details.firstNameOfChild
        );
        expect(csvObjDevelopmental[0].firstNameOfChild).toEqual("Devin");
      });

      describe("for a single result", () => {
        beforeEach(async () => {
          setupMailgun();
          payload = buildDefaultPayload();
          let response = await fetch(resultUrl(), {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }
          });
          let json = await response.json();
          expect(response.status).toBe(200);
          expect(json).toEqual({ status: "OK" });

          let csvResponse = await getCsv("main");
          expect(csvResponse.status).toBe(200);

          const csvText = await csvResponse.text();
          csvObj = parse(csvText, { columns: true });
        });

        it("outputs details correctly", async () => {
          const detailsKeys = Object.keys(payload.details);

          expect(detailsKeys.length).toEqual(10);

          for (let key of detailsKeys) {
            expect(
              csvObj[0][key],
              `${key} was not equal between CSV and input`
            ).toEqual((payload.details as any)[key]);
          }
        });

        it("outputs consent correctly", async () => {
          const consentKeys = Object.keys(payload.consent);

          expect(
            consentKeys.length,
            `${JSON.stringify(consentKeys)}.length did not equal 7`
          ).toEqual(7);

          for (let key of consentKeys) {
            expect(
              csvObj[0][key],
              `${key} was not equal between CSV and input`
            ).toEqual((payload.consent as any)[key].toString());
          }
        });

        it("outputs question answers correctly", async () => {
          const questionnaireIds = Object.keys(payload.results);

          expect(questionnaireIds.length).toBeGreaterThan(0);

          const hasAtLeastOneComment = _(
            payload.results
          ).some(questionnaireResult =>
            _(questionnaireResult).some(answer => !!answer.comments)
          );
          expect(hasAtLeastOneComment).toBe(true);

          for (let questionnaireId of questionnaireIds) {
            const questionIds = Object.keys(payload.results[questionnaireId]);

            expect(questionIds.length).toBeGreaterThan(0);

            for (let questionId of questionIds) {
              const answer = payload.results[questionnaireId][questionId];

              const answerColumnHeader = `${questionnaireId}:${questionId}:answer`;
              expect(
                csvObj[0][answerColumnHeader],
                `${answerColumnHeader} was not correct in the CSV`
              ).toEqual(answer.value);

              const commentColumnHeader = `${questionnaireId}:${questionId}:comments`;
              if (!!answer.comments || csvObj[0][commentColumnHeader] != "") {
                expect(
                  csvObj[0][commentColumnHeader],
                  `${commentColumnHeader} was not correct in the CSV`
                ).toEqual(
                  payload.results[questionnaireId][questionId].comments
                );
              }
            }
          }
        });
      });
    });
  });
});
