const questionnairesForSubsite = require("./questionnaires-for-subsite");

module.exports = function(months, subsite) {
  return questionnairesForSubsite(subsite)
    .filter(questionnaire => {
      const ageGroups = questionnaire.age_groups;

      return months >= ageGroups.min && months <= ageGroups.max;
    })
    .map(questionnaire => {
      return questionnaire.questions.map(question => {
        question.questionnaire = questionnaire;
        return question;
      });
    })
    .reduce((soFar, questions) => soFar.concat(questions))
    .reduce((soFar, question, i) => {
      soFar[i + 1] = question;
      return soFar;
    }, {});
};
