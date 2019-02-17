import path from "path";
import i18n from "i18next";
import i18nextNodeFsBackend from "i18next-node-fs-backend";

export default function buildi18n(language: string) {
  return i18n.use(i18nextNodeFsBackend).init({
    lng: language || "en",
    fallbackLng: "en",
    missingKeyHandler: (
      lngs: string[],
      ns: string,
      key: string,
      fallbackValue: string
    ) => {
      console.log(`Missing key ${key} in ns ${ns} with lngs ${lngs}`);
    },
    backend: {
      loadPath:
        path.join(
          require.resolve("@wmg/common/locales/en/default.json"),
          "..",
          ".."
        ) + "/{{lng}}/{{ns}}.json"
    },
    // debug: true, //process.env.NODE_ENV === "development",
    ns: ["default"],
    defaultNS: "default",
    interpolation: {
      escapeValue: false
    }
  });
}
