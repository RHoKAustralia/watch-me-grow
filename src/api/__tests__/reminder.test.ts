import http, { IncomingMessage, ServerResponse } from "http";
import fetch from "isomorphic-unfetch";
import listen from "test-listen";
import { apiResolver } from "next-server/dist/server/api-utils";
import parse from "csv-parse/lib/sync";
import { advanceBy, advanceTo, clear } from "jest-date-mock";

import { buildDefaultPayload } from "./fixtures";
import _ from "lodash";

import {
  testResultHarness,
  MAILGUN_MESSAGES_PATH,
  MailgunInput
} from "./test-harness";

import handler from "pages/api/reminder";
import moment from "moment";
const REMINDER_REQUEST_HANDLER = (req: any, res: any) =>
  apiResolver(req, res, undefined, handler);

const PASSWORD = "secret";

testResultHarness(
  ({ setupDb, teardownDb, setupMailgun, url: resultUrl, mailgunScope }) => {
    describe("reminder", () => {
      let server: http.Server;
      let reminderUrl: string;

      beforeAll(() => {
        process.env.WMG_PASSWORD = PASSWORD;
      });

      afterAll(() => {
        delete process.env.WMG_PASSWORD;
      });

      beforeEach(async () => {
        await setupDb();
        setupMailgun();
        server = http.createServer(REMINDER_REQUEST_HANDLER);
        reminderUrl = await listen(server);
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

      const postReminder = (siteId: string) => {
        return fetch(`${reminderUrl}`, {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(
              "admin" + ":" + "secret"
            ).toString("base64")}`
          }
        });
      };

      it("is able to remind for a single result", async () => {
        advanceTo(moment.utc("2019-01-01").toDate());

        // Put a result in
        const payload = buildDefaultPayload();

        payload.details.dobOfChild = moment.utc("2018-04-01").toISOString();

        const recordResponse = await fetch(resultUrl(), {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json"
          }
        });
        expect(recordResponse.status).toEqual(200);

        mailgunScope()
          .post(MAILGUN_MESSAGES_PATH, body => {
            expect(body.to).toEqual(payload.details.recipientEmail);
            expect(body.subject).toEqual(
              `WatchMeGrow.care reminder for ${payload.details.firstNameOfChild}`
            );

            expect(body.html).toContain("9 months old");
            expect(body.html).toContain('<a href="https://watchmegrow.care"');

            return true;
          })
          .reply(200);

        const reminderResponse = await postReminder(payload.details.siteId);

        expect(reminderResponse.status).toEqual(200);
      });
    });
  }
);
