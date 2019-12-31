import http, { IncomingMessage, ServerResponse } from "http";
import fetch from "isomorphic-unfetch";
import listen from "test-listen";
import { apiResolver } from "next-server/dist/server/api-utils";
import nock from "nock";
import _ from "lodash";
const DBMigrate = require("db-migrate");

process.env.MAILGUN_API_KEY = "abc";
import handler from "pages/api/result";

Error.stackTraceLimit = Infinity;

const dbmigrate = DBMigrate.getInstance(true, {
  env: "test",
  throwUncatched: true
});
const dbmigrateCreate = DBMigrate.getInstance(true, {
  env: "test-create",
  throwUncatched: true
});
export const MAILGUN_API_HOST = "https://api.mailgun.net";
export const MAILGUN_MESSAGES_PATH = "/v3/auto.watchmegrow.care/messages";

const RESULTS_REQUEST_HANDLER = (req: any, res: any) =>
  apiResolver(req, res, undefined, handler);
dbmigrate.silence(true);

export type MailgunInput = {
  from: string;
  to: string;
  subject: string;
  html: string;
};

type Args = {
  url: () => string;
  setupDb: () => Promise<void>;
  teardownDb: () => Promise<void>;
  setupMailgun: () => void;
  mailgunScope: () => nock.Scope;
};

export const testResultHarness = (thingsToDo: (args: Args) => void) => {
  describe("/result", () => {
    let server: http.Server;
    let url: string;
    let mailgunScope: nock.Scope;

    const setupDb = () => dbmigrate.up();
    const teardownDb = () => dbmigrate.down();

    beforeAll(async () => {
      try {
        dbmigrateCreate.internals.argv._[0] = "test-wmg";
        await dbmigrateCreate.createDatabase("test-wmg");
      } catch (e) {
        console.error(e);
        throw e;
      }
    });

    afterAll(async () => {
      await dbmigrateCreate.dropDatabase("test-wmg");
    });

    beforeEach(async () => {
      try {
        server = http.createServer(RESULTS_REQUEST_HANDLER);
        url = await listen(server);
        mailgunScope = nock(MAILGUN_API_HOST);
      } catch (e) {
        console.error(e);
        throw e;
      }
    });

    afterEach(async () => {
      try {
        expect(nock.isDone(), nock.pendingMocks().join(", ")).toBe(true);
      } finally {
        try {
          // nock.restore();
          nock.cleanAll();

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

    thingsToDo({
      url: () => url,
      setupDb,
      teardownDb,
      setupMailgun,
      mailgunScope: () => mailgunScope
    });
  });
};
