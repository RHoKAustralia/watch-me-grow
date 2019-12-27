import fetch from "isomorphic-unfetch";

import {
  DEFAULT_DOCTOR_EMAIL,
  DEFAULT_PARENT_EMAIL,
  buildDefaultPayload,
  buildNoConcernPayload,
  DEFAULT_PAYLOAD
} from "./fixtures";
import _ from "lodash";

import { NotifyFunctionInput } from "src/common/notify-function-input";
import questionnaires from "src/common/questionnaires";
import buildi18n from "../i18n";
import {
  testResultHarness,
  MAILGUN_MESSAGES_PATH,
  MailgunInput
} from "./test-harness";

testResultHarness(
  ({ setupDb, teardownDb, setupMailgun, url, mailgunScope }) => {
    describe("emails: ", () => {
      beforeAll(setupDb);
      afterAll(teardownDb);

      const checkEmail = async (
        recipient: string,
        emailCheckerFn: (body: any) => boolean,
        payload: NotifyFunctionInput = buildDefaultPayload()
      ) => {
        mailgunScope()
          .post(MAILGUN_MESSAGES_PATH, body => {
            return body.to === recipient && emailCheckerFn(body);
          })
          .reply(200);

        mailgunScope()
          .post(MAILGUN_MESSAGES_PATH)
          .reply(200);

        let response = await fetch(url(), {
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
                  `${escapeRegExp(
                    t(question.textId)
                  )}</td>\\s*<td>${escapeRegExp(t(answerMetadata.textId))}`
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

        describe("concern = true", () => {
          let email: MailgunInput;

          beforeEach(() => {
            return checkEmail(DEFAULT_PARENT_EMAIL, newEmail => {
              email = newEmail;
              return true;
            });
          });

          it("shows concern correctly", async () => {
            expect(email.html).toContain(
              "Your answers indicate that your child could benefit from a more detailed assessment. Please discuss these results with your health professional."
            );
          });
        });

        describe("concern = false", () => {
          let email: MailgunInput;

          beforeEach(() => {
            return checkEmail(
              DEFAULT_PARENT_EMAIL,
              newEmail => {
                email = newEmail;
                return true;
              },
              buildNoConcernPayload()
            );
          });

          it("shows lack of concern correctly", async () => {
            expect(email.html).toContain(
              "Your child is developing as expected for their age. Based on your answers you have no concerns about how your child is developing."
            );
          });
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
  }
);

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}
