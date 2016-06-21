import { observable } from 'mobx';
import questionnaires from '../data/questionnaires';

class ResultStore {
  @observable results = {};

  constructor() {
    this.questions = questionnaires
      .map(questionnaire => {
        return questionnaire.questions.map(question => {
          question.questionnaire = questionnaire;
          return question;
        });
      })
      .reduce((soFar, questions) => soFar.concat(questions));
  }


}

export default ResultStore;