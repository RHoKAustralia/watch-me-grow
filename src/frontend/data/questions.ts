import getQuestions from "src/common/questions";
import subsite from "../util/subsite";

export default (months: number) => getQuestions(months, subsite!);
