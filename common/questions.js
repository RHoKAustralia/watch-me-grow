const questionnaires = require('./questionnaires');

module.exports = questionnaires
  .map(questionnaire => {
    return questionnaire.questions.map(question => {
      question.questionnaire = questionnaire;
      return question;
    });
  })
  .reduce((soFar, questions) => soFar.concat(questions))
  .reduce((soFar, question, i) => {soFar[i + 1] = question; return soFar}, {});
