const questionnaires = require("./questionnaires");

module.exports = function(months) {
  return questionnaires
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
