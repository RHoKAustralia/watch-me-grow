import http, { IncomingMessage, ServerResponse } from "http";
import fetch from "isomorphic-unfetch";
import listen from "test-listen";
import { apiResolver } from "next-server/dist/server/api-utils";
import parse from "csv-parse/lib/sync";

import { buildDefaultPayload } from "./fixtures";
import _ from "lodash";

import { testResultHarness } from "./test-harness";

import handler from "../download-csv";
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
      it("outputs details correctly", async () => {
        const payload = buildDefaultPayload();
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
        const csvObjLine1 = parse(csvText, { columns: true })[0];

        const detailsKeys = Object.keys(payload.details);

        expect(detailsKeys.length).toEqual(10);

        for (let key of detailsKeys) {
          expect(
            csvObjLine1[key],
            `${key} was not equal between CSV and input`
          ).toEqual((payload.details as any)[key]);
        }
      });
    });
  });
});
