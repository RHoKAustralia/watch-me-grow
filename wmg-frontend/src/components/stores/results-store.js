import React from "react";

import {
  mark,
  combineAll,
  combineQuestionsAndAnswers,
  getOverallResult
} from "wmg-common/data-functions";
import questionnaires from "wmg-common/questionnaires";
import questions from "wmg-common/questions";

const LOCAL_STORAGE_KEY = "wmg-results";

const ResultStore = (ComposedComponent) => class extends React.Component {
  UNSAFE_componentWillMount() {
    const resultsString = sessionStorage.getItem(LOCAL_STORAGE_KEY);

    this.setState(resultsString ? JSON.parse(resultsString) : {});
  }

  setAnswer = (questionnaireId, questionId, value, comments) => {
    const forQuestionnaire = this.getResultsForQuestionnaire(questionnaireId);

    forQuestionnaire[questionId] = { value, comments };

    this.setState({
      [questionnaireId]: forQuestionnaire
    });
  };

  getResultsForQuestionnaire = (questionnaireId) => {
    return this.state[questionnaireId] ? this.state[questionnaireId] : {};
  };

  save = () => {
    sessionStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.state));
  };

  getAnswer = (questionnaireId, questionId) => {
    return this.getResultsForQuestionnaire(questionnaireId)[questionId];
  };

  mark = () => {
    this.setState({ concern: mark(combineAll(this.state)) !== "NO_FLAG" });
  };

  clear = () => {
    sessionStorage.removeItem(LOCAL_STORAGE_KEY);
    this.setState(
      Object.keys(this.state).reduce((acc, id) => {
        acc[id] = undefined;
        return acc;
      }, {})
    );
  };

  isComplete = () => {
    return Object.keys(questions).every(index => {
      const question = questions[index];
      return !!this.getAnswer(question.questionnaire.id, question.id);
    });
  };

  render() {
    const results = Object.assign({}, this.state, {
      getResultsForQuestionnaire: this.getResultsForQuestionnaire,
      getAnswer: this.getAnswer,
      setAnswer: this.setAnswer,
      save: this.save,
      mark: this.mark,
      clear: this.clear,
      isComplete: this.isComplete
    });

    return <ComposedComponent {...this.props} results={results} />;
  }
};

export default ResultStore;
