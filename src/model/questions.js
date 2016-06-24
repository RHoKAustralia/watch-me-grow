import questionnaires from '../data/questionnaires';

export default questionnaires
  .map(questionnaire => {
    return questionnaire.questions.map(question => {
      question.questionnaire = questionnaire;
      return question;
    });
  })
  .reduce((soFar, questions) => soFar.concat(questions));