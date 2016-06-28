import { observable } from 'mobx';

const LOCAL_STORAGE_KEY = 'wmg-results';

class ResultStore {
  @observable results;

  constructor() {
    const resultsString = sessionStorage.getItem(LOCAL_STORAGE_KEY);

    if (resultsString) {
      this.results = JSON.parse(resultsString);
    } else {
      this.results = {};
    }
  }

  saveAnswer(questionnaireId, questionId, value) {
    this.getQuestionnaireResults(questionnaireId)[questionId] = value;

    this.save();
  }

  getAnswer(questionnaireId, questionId) {
    return this.getQuestionnaireResults(questionnaireId)[questionId];
  }

  getQuestionnaireResults(questionnaireId) {
    return this.results[questionnaireId] = this.results[questionnaireId] || {};
  }

  save() {
    sessionStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.results));
  }
}

export default ResultStore;