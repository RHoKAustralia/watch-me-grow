export default function ageInMonthsToString(ageInMonths: number) {
  return ageInMonths < 24
    ? ageInMonths + " months"
    : Math.floor(ageInMonths / 12) + " years";
}
