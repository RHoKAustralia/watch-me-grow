const mailgunJs = require("mailgun-js");

export default mailgunJs({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: "auto.watchmegrow.care"
});

export const EMAIL_FROM = "WatchMeGrow.care <mail@watchmegrow.care>";