import { observable, computed, extendObservable, action, map } from 'mobx';

const LOCAL_STORAGE_KEY = 'wmg-results';

class ResultStore {
  @observable results;

  constructor() {
    const resultsString = sessionStorage.getItem(LOCAL_STORAGE_KEY);

    if (resultsString) {
      const resultsMap = JSON.parse(resultsString);

      this.results = Object.keys(resultsMap).reduce((soFar, key) => {
        soFar.set(key, map(resultsMap[key]));
        return soFar;
      }, map());
    } else {
      this.results = map();
    }
  }

  @action
  saveAnswer(questionnaireId, questionId, value, comments) {
    if (!this.results.has(questionnaireId)) {
      this.results.set(questionnaireId, map());
    }

    this.results.get(questionnaireId).set(questionId, {value, comments});

    this.save();
  }

  static getAnswer(results, questionnaireId, questionId) {
    return (results.has(questionnaireId) ? results.get(questionnaireId) : map()).get(questionId);
  }

  save() {
    sessionStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.results));
  }
}

export default ResultStore;