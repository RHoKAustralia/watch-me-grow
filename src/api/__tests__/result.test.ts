import http, { IncomingMessage, ServerResponse } from "http";
import fetch from "isomorphic-unfetch";
import listen from "test-listen";
import { apiResolver } from "next-server/dist/server/api-utils";
import { NextApiRequest, NextApiResponse } from "next";
import {
  DEFAULT_DOCTOR_EMAIL,
  DEFAULT_PARENT_EMAIL,
  buildDefaultPayload,
  buildNoConcernPayload,
  DEFAULT_PAYLOAD
} from "./fixtures";
import nock from "nock";
import pool from "../../db/pool";
const DBMigrate = require("db-migrate");

process.env.MAILGUN_API_KEY = "abc";
Error.stackTraceLimit = Infinity;

import handler from "../result";
import { NotifyFunctionInput } from "src/common/notify-function-input";

const dbmigrate = DBMigrate.getInstance(true, {
  env: "test",
  throwUncatched: true
});
const dbmigrateCreate = DBMigrate.getInstance(true, {
  env: "test-create",
  throwUncatched: true
});
const MAILGUN_API_HOST = "https://api.mailgun.net";
const MAILGUN_MESSAGES_PATH = "/v3/auto.watchmegrow.care/messages";

const REQUEST_HANDLER = (req: any, res: any) =>
  apiResolver(req, res, undefined, handler);
dbmigrate.silence(true);

type MailgunInput = {
  from: string;
  to: string;
  subject: string;
  html: string;
};

describe("/result", () => {
  let server: http.Server;
  let url: string;
  let mailgunScope: nock.Scope;

  const setupDb = () => dbmigrate.up();
  const teardownDb = () => dbmigrate.down();

  beforeAll(async () => {
    try {
      await dbmigrateCreate.createDatabase("test-wmg");
    } catch (e) {
      console.error(e);
      throw e;
    }
  });

  afterAll(async () => {
    // await (pool as any).end();
    await dbmigrateCreate.dropDatabase("test-wmg");
  });

  beforeEach(async () => {
    try {
      server = http.createServer(REQUEST_HANDLER);
      url = await listen(server);
      mailgunScope = nock(MAILGUN_API_HOST);
    } catch (e) {
      console.error(e);
      throw e;
    }
  });

  afterEach(async () => {
    try {
      nock.cleanAll();
      mailgunScope.done();
      await new Promise((res, rej) => {
        server.close(err => {
          if (err) {
            rej(err);
          } else {
            res();
          }
        });
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  });

  // nock.emitter.on("no match", req => {
  //   console.log(req);
  // });

  /**
   * Make mailgun respond 200 no matter what gets posted to it.
   */
  const setupMailgun = () => {
    mailgunScope
      .post(MAILGUN_MESSAGES_PATH)
      .times(2)
      .reply(200);
  };

  test("responds 200 to authed POST", async () => {
    try {
      await setupDb();
      setupMailgun();
      expect.assertions(2);
      let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(buildDefaultPayload()),
        headers: {
          "Content-Type": "application/json"
        }
      });
      let json = await response.json();
      expect(response.status).toBe(200);
      expect(json).toEqual({ status: "OK" });
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      await teardownDb();
    }
  });

  describe("emails: ", () => {
    beforeAll(setupDb);
    afterAll(teardownDb);

    const checkEmail = async (
      recipient: string,
      emailCheckerFn: (body: any) => boolean,
      payload: NotifyFunctionInput = buildDefaultPayload()
    ) => {
      mailgunScope
        .post(MAILGUN_MESSAGES_PATH, body => {
          return body.to === recipient && emailCheckerFn(body);
        })
        .reply(200);

      mailgunScope.post(MAILGUN_MESSAGES_PATH).reply(200);

      let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json"
        }
      });
      expect(response.status).toBe(200);
    };

    describe("doctor email", () => {
      describe("regardless of concerns", () => {
        let email: MailgunInput;

        beforeEach(() => {
          return checkEmail(DEFAULT_DOCTOR_EMAIL, newEmail => {
            email = newEmail;
            return true;
          });
        });

        it("subject is correct", async () => {
          expect(email.subject).toEqual(
            "WatchMeGrow.care results for TestFirstName"
          );
        });

        it("contains the range of ages", async () => {
          expect(email.html).toContain(`6 months to 6 years`);
        });

        it("contains test #", async () => {
          // Make a new db so we can predict the test #
          await teardownDb();
          await setupDb();

          await checkEmail(DEFAULT_DOCTOR_EMAIL, body => {
            expect(body.html).toContain(`Test "1"`);
            expect(body.html).toMatch(/<td>Test ID<\/td>\s*<td>1<\/td>/);
            return true;
          });

          await checkEmail(DEFAULT_DOCTOR_EMAIL, body => {
            expect(body.html).toContain(`Test "2"`);
            expect(body.html).toMatch(/<td>Test ID<\/td>\s*<td>2<\/td>/);
            return true;
          });
        });

        it("contains child's name", async () => {
          expect(email.html).toContain(
            `for ${DEFAULT_PAYLOAD.details.firstNameOfChild} ${DEFAULT_PAYLOAD.details.lastNameOfChild}`
          );
        });
      });

      describe("concern = true", () => {
        let email: MailgunInput;

        beforeEach(() => {
          return checkEmail(DEFAULT_DOCTOR_EMAIL, newEmail => {
            email = newEmail;
            return true;
          });
        });

        it("shows concern correctly", async () => {
          expect(email.html).toContain(
            "It is highly likely that this child has developmental issues. It is recommended that a referral for further assessment and early intervention through a paediatrician or other child development health professional is completed. In addition, it is important to continue to monitor the child over time."
          );
        });
      });

      describe("concern = false", () => {
        let email: MailgunInput;

        beforeEach(() => {
          return checkEmail(
            DEFAULT_DOCTOR_EMAIL,
            newEmail => {
              email = newEmail;
              return true;
            },
            buildNoConcernPayload()
          );
        });

        it("shows lack of concern correctly", async () => {
          expect(email.html).toContain(
            "Developmental issues in this child are unlikely. No further follow-up necessary at this point. Continue ongoing monitoring as usual"
          );
        });
      });
    });
  });
});
