import questionnairesForSubsite from "@wmg/common/lib/questionnaires-for-subsite";
import subsite from "../util/subsite";

export default (subsite ? questionnairesForSubsite(subsite.id) : undefined);
