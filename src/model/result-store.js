import { observable } from 'mobx';

const LOCAL_STORAGE_KEY = 'wmg-results';

class ResultStore {
  @observable results;

  constructor() {
    const resultsString = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (resultsString) {
      this.results = JSON.parse(resultsString);
    } else {
      this.results = {};
    }
  }

  saveAnswer(questionnaireId, questionId, value) {
    const questionnaireResults = this.results[questionnaireId] = this.results[questionnaireId] || {};
    questionnaireResults[questionId] = value;

    this.save();
  }

  save() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.results));
  }
}

export default ResultStore;