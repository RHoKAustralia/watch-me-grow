import NextI18Next from "next-i18next";

export default new NextI18Next({
  fallbackLng: "en",
  defaultLanguage: "en",
  otherLanguages: ["id"],
  debug: process.env.NODE_ENV === "development",
  ns: ["default"],
  defaultNS: "default",
  interpolation: {
    escapeValue: false
  }
});
