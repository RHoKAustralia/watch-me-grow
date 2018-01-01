const siteSpecificConfig = require("./site-specific-config");
const _ = require("lodash");
const questionnaires = require("./questionnaires");

module.exports = function getQuestionnairesForSubsite(configId) {
  const includeQuestionnaireIds = _.get(siteSpecificConfig, [
    configId,
    questionnaires
  ]);

  if (!includeQuestionnaireIds) {
    return questionnaires;
  } else {
    return questionnaires.filter(questionnaire =>
      _.includes(includeQuestionnaireIds, questionnaire.id)
    );
  }
};
