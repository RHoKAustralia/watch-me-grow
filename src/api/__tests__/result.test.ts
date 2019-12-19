import http, { IncomingMessage, ServerResponse } from "http";
import fetch from "isomorphic-unfetch";
import listen from "test-listen";
import { apiResolver } from "next-server/dist/server/api-utils";
import { NextApiRequest, NextApiResponse } from "next";
import nock from "nock";
import pool from "../../db/pool";
const DBMigrate = require("db-migrate");

process.env.MAILGUN_API_KEY = "abc";
Error.stackTraceLimit = Infinity;

import handler from "../result";

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

const DEFAULT_PARENT_EMAIL = "test.parent@example.com";
const DEFAULT_DOCTOR_EMAIL = "test.doctor@example.com";

const REQUEST_HANDLER = (req: any, res: any) =>
  apiResolver(req, res, undefined, handler);
dbmigrate.silence(true);

describe("/result", () => {
  let server: http.Server;
  let url: string;
  let mailgunScope: nock.Scope;

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
      await dbmigrate.up();

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
      await dbmigrate.down();
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

  const buildPost = () => {
    return {
      details: {
        recipientEmail: DEFAULT_PARENT_EMAIL,
        testDate: "2019-12-09T12:14:22.933Z",
        nameOfParent: "Test Parent",
        firstNameOfChild: "TestFirstName",
        lastNameOfChild: "Test",
        genderOfChild: "male",
        dobOfChild: "2019-05-28T14:00:00.000Z",
        doctorEmail: DEFAULT_DOCTOR_EMAIL,
        ageInMonths: 6,
        siteId: "main",
        language: "en"
      },
      results: {
        cdc6: {
          reach6: { value: "no" },
          affection6: { value: "no" },
          respond_to_sounds6: { value: "yes" },
          difficulty_mouth6: { value: "no" },
          vowel_sounds6: { value: "yes" },
          roll6: { value: "yes" },
          squealing6: { value: "no" },
          tight_muscles6: { value: "no" },
          lost_skills: { value: "yes" }
        },
        peds: {
          concerns: { value: "alittle", comments: "aerg" },
          speech_sound: { value: "no" },
          understand_speech: { value: "no" },
          using_hand: { value: "no" },
          using_arm_leg: { value: "no" },
          behaviour: { value: "no" },
          getting_along: { value: "no" },
          learning: { value: "no" },
          learning_at_preschool: { value: "no" },
          other_concerns: { value: "no" }
        }
      },
      consent: {
        receiveCopy: false,
        understandConsent: false,
        infoSheet: false,
        understandAim: false,
        opportunityToAsk: false,
        agreeToParticipate: false
      }
    };
  };

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
      setupMailgun();
      expect.assertions(2);
      let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(buildPost()),
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
    }
  });

  describe("emails: ", () => {
    const checkEmail = async (
      recipient: string,
      emailCheckerFn: (body: any) => boolean
    ) => {
      mailgunScope
        .post(MAILGUN_MESSAGES_PATH, body => {
          return body.to === recipient && emailCheckerFn(body);
        })
        .reply(200);

      mailgunScope.post(MAILGUN_MESSAGES_PATH).reply(200);

      let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(buildPost()),
        headers: {
          "Content-Type": "application/json"
        }
      });
      expect(response.status).toBe(200);
    };

    describe("doctor email", () => {
      it("subject is correct", async () => {
        await checkEmail(DEFAULT_DOCTOR_EMAIL, body => {
          expect(body.subject).toEqual(
            "WatchMeGrow.care results for TestFirstName"
          );
          return true;
        });
      });

      describe("shows concern correctly", () => {
        it("for concern === true", async () => {
          await checkEmail(DEFAULT_DOCTOR_EMAIL, body => {
            expect(body.html).toContain(
              "It is highly likely that this child has developmental issues. It is recommended that a referral for further assessment and early intervention through a paediatrician or other child development health professional is completed. In addition, it is important to continue to monitor the child over time."
            );
            return true;
          });
        });
      });
    });
  });
});
