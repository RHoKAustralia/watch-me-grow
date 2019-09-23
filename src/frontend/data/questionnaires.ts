import questionnairesForSubsite from "src/common/questionnaires-for-subsite";
import { getConfigByHost } from "src/common/site-specific-config";

export default function questionnaires() {
  const subsite = getConfigByHost(window.location.hostname);
  return questionnairesForSubsite(subsite!.id);
}
