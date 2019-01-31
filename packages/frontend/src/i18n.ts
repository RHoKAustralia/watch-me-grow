import i18n from "i18next";
import { withI18n, reactI18nextModule } from "react-i18next";
import i18nextXHRBackend from "i18next-xhr-backend";
import config from "./util/subsite";

i18n
  .use(i18nextXHRBackend)
  .use(reactI18nextModule)
  .init({
    lng: (config && config.language) || "en",
    fallbackLng: "en",
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
      crossDomain: false
    },
    debug: process.env.NODE_ENV === "development",
    ns: ["default"],
    defaultNS: "default",
    interpolation: {
      escapeValue: false
    }
  });
