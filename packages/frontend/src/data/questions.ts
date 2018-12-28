import getQuestions from "@wmg/common/lib/questions";
import subsite from "../util/subsite";

export default (months: number) => getQuestions(months, subsite!);
