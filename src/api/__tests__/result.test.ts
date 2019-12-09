import http, { IncomingMessage, OutgoingMessage } from "http";
import fetch from "isomorphic-unfetch";
import listen from "test-listen";
import { apiResolver } from "next-server/dist/server/api-utils";
import { NextApiRequest, NextApiResponse } from "next";
import nock from "nock";
const DBMigrate = require("db-migrate");

const dbmigrate = DBMigrate.getInstance(true, {
  env: "test",
  throwUncatched: true
});

process.env.MAILGUN_API_KEY = "abc";

import handler from "../result";

describe("/ handler", () => {
  beforeAll(async () => {
    await dbmigrate.createDatabase("test-wmg");
  });

  beforeEach(async () => {
    await dbmigrate.up();
  });

  afterEach(() => {
    return dbmigrate.reset();
  });

  afterAll(async () => {
    await dbmigrate.dropDatabase("test-wmg");
  });

  // beforeAll(() => {
  // nock.disableNetConnect();
  // });

  // afterAll(() => {
  //   // nock.enableNetConnect();
  // });

  const buildPost = () => {
    return {
      details: {
        recipientEmail: "test.parent@example.com",
        testDate: "2019-12-09T12:14:22.933Z",
        nameOfParent: "Test Parent",
        firstNameOfChild: "Test",
        lastNameOfChild: "Test",
        genderOfChild: "male",
        dobOfChild: "2019-05-28T14:00:00.000Z",
        doctorEmail: "test.doctor@example.com",
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

  test("responds 200 to authed POST", async () => {
    try {
      expect.assertions(2);
      // console.log(process.env.MAILGUN_API_KEY);
      let requestHandler = (req: any, res: any) =>
        apiResolver(req, res, undefined, handler);
      let server = http.createServer(requestHandler);
      let url = await listen(server);
      let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(buildPost()),
        headers: {
          "Content-Type": "application/json"
        }
      });
      let json = await response.json();
      expect(response.status).toBe(200);
      expect(json).toEqual({ pong: "pong" });
    } catch (e) {
      console.error(e);
      throw e;
    }
  });
});
