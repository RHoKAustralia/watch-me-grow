import http, { IncomingMessage, ServerResponse } from "http";
import fetch from "isomorphic-unfetch";
import listen from "test-listen";
import { apiResolver } from "next-server/dist/server/api-utils";
import parse from "csv-parse/lib/sync";

import { buildDefaultPayload } from "./fixtures";
import _ from "lodash";

import { testResultHarness } from "./test-harness";

import handler from "../download-csv";
import { NotifyFunctionInput } from "src/common/notify-function-input";
import questionnaires from "src/common/questionnaires";
const CSV_REQUEST_HANDLER = (req: any, res: any) =>
  apiResolver(req, res, undefined, handler);

testResultHarness(({ setupDb, teardownDb, setupMailgun, url: resultUrl }) => {
  describe("persistence", () => {
    let server: http.Server;
    let csvUrl: string;

    beforeEach(async () => {
      await setupDb();
      setupMailgun();
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

    describe("csv", () => {
      let csvObj: any;
      let payload: NotifyFunctionInput;

      beforeEach(async () => {
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

        let csvResponse = await fetch(csvUrl + "?siteId=main", {
          method: "GET"
        });
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
              ).toEqual(payload.results[questionnaireId][questionId].comments);
            }
          }
        }
      });
    });
  });
});
