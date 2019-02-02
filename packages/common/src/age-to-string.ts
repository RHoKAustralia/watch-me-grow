import i18next from "i18next";

export default function ageInMonthsToString(
  ageInMonths: number,
  t: i18next.TFunction
) {
  return ageInMonths < 24
    ? t("app.month", { count: ageInMonths })
    : t("app.year", { count: Math.floor(ageInMonths / 12) });
}
