import questionnairesForSubsite from "src/common/questionnaires-for-subsite";
import subsite from "../util/subsite";

export default subsite ? questionnairesForSubsite(subsite.id) : undefined;
