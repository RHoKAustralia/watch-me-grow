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
import _ from "lodash";

const DBMigrate = require("db-migrate");

process.env.MAILGUN_API_KEY = "abc";
Error.stackTraceLimit = Infinity;

import handler from "../result";
import { NotifyFunctionInput } from "src/common/notify-function-input";
import questionnaires from "src/common/questionnaires";
import buildi18n from "../i18n";

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

    function commonEmailTests(emailGetter: () => Promise<MailgunInput>) {
      let email: MailgunInput;

      beforeEach(async () => (email = await emailGetter()));

      it("contains test #", async () => {
        await checkEmail(DEFAULT_DOCTOR_EMAIL, body => {
          expect(body.html).toMatch(
            /Test "\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b"/
          );
          expect(body.html).toMatch(
            /<td>Test ID<\/td>\s*<td>\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b<\/td>/
          );
          return true;
        });
      });

      it("subject is correct", async () => {
        expect((await emailGetter()).subject).toEqual(
          "WatchMeGrow.care results for TestFirstName"
        );
      });

      it("displays the date of the test", async () => {
        expect(email.html).toContain("Monday, December 9th 2019");
      });

      it("displays all of the questions and answers", async () => {
        // First do a manual test against a hard-coded value
        expect(email.html).toMatch(
          /<td>Does your child try to get things that are in reach\?<\/td>\s*<td>No<\/td>/
        );

        // Now do an auto test against all the values.
        const t = await buildi18n("en");

        const questions = _(questionnaires)
          .flatMap(questionnaire =>
            questionnaire.questions.map(question => ({
              questionnaireId: questionnaire.id,
              question
            }))
          )
          .keyBy(
            ({ questionnaireId, question }) =>
              `${questionnaireId}-${question.id}`
          )
          .mapValues(({ question }) => question)
          .value();

        for (let [questionnaireId, questionnaireAnswers] of _.toPairs(
          DEFAULT_PAYLOAD.results
        )) {
          for (let [questionId, { value: answerId }] of _.toPairs(
            questionnaireAnswers
          )) {
            const question = questions[`${questionnaireId}-${questionId}`];
            const answers = _.keyBy(question.answers, answer => answer.value);
            const answerMetadata = answers[answerId];

            expect(email.html).toMatch(
              new RegExp(
                `${escapeRegExp(t(question.textId))}</td>\\s*<td>${escapeRegExp(
                  t(answerMetadata.textId)
                )}`
              )
            );
          }
        }
      });
    }

    describe("guardian email", () => {
      describe("regardless of concerns", () => {
        const emailGetter: () => Promise<MailgunInput> = () =>
          new Promise((resolve, reject) =>
            checkEmail(DEFAULT_PARENT_EMAIL, newEmail => {
              resolve(newEmail);
              return true;
            })
          );

        commonEmailTests(emailGetter);
      });
    });

    describe("doctor email", () => {
      describe("regardless of concerns", () => {
        const emailGetter: () => Promise<MailgunInput> = () =>
          new Promise((resolve, reject) =>
            checkEmail(DEFAULT_DOCTOR_EMAIL, newEmail => {
              resolve(newEmail);
              return true;
            })
          );

        it("contains child's first name", async () => {
          expect((await emailGetter()).html).toContain(
            `for ${DEFAULT_PAYLOAD.details.firstNameOfChild}`
          );
        });

        it("does not contain child's last name", async () => {
          // Because we don't want the child to be too easily identifiable.
          expect((await emailGetter()).html).not.toContain(
            DEFAULT_PAYLOAD.details.lastNameOfChild
          );
        });

        it("contains the range of ages", async () => {
          expect((await emailGetter()).html).toContain(`6 months to 6 years`);
        });

        commonEmailTests(emailGetter);
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

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}
