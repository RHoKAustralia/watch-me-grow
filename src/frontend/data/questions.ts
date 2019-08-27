import getQuestions from "src/common/questions";
import { getConfigByHost } from "src/common/site-specific-config";

export default (months: number) =>
  getQuestions(months, getConfigByHost(window.location.hostname));
