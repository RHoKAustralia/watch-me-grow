const mailgunJs = require("mailgun-js");
import config from "config";

export default mailgunJs({
  apiKey: config.get("mailgun.apiKey"),
  domain: "auto.watchmegrow.care"
});

export const EMAIL_FROM = "WatchMeGrow.care <mail@watchmegrow.care>";
