import React from 'react';

import {combineQuestionsAndAnswers, getOverallResult} from '../../data/data-functions';
import questionnaires from '../../data/questionnaires';

const LOCAL_STORAGE_KEY = 'wmg-results';

const ResultStore = ComposedComponent => React.createClass({
    componentWillMount() {
        const resultsString = sessionStorage.getItem(LOCAL_STORAGE_KEY);

        this.setState(resultsString ? JSON.parse(resultsString) : {});
    },

    setAnswer(questionnaireId, questionId, value, comments) {
        const forQuestionnaire = this.getResultsForQuestionnaire(questionnaireId);

        forQuestionnaire[questionId] = {value, comments};

        this.setState({
            [questionnaireId]: forQuestionnaire
        });
    },

    getResultsForQuestionnaire(questionnaireId) {
        return this.state[questionnaireId] ? this.state[questionnaireId] : {};
    },

    save() {
        sessionStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.state));
    },

    getAnswer(questionnaireId, questionId) {
        return this.getResultsForQuestionnaire(questionnaireId)[questionId];
    },

    mark() {
        const concern = questionnaires.map(questionnaire => {
            const combined = combineQuestionsAndAnswers(
                questionnaire.questions, this.getResultsForQuestionnaire(questionnaire.id)
            );

            return getOverallResult(questionnaire, combined);
        }).some(flag => flag === 'RED_FLAG' || flag === 'AMBER_FLAG');

        this.setState({concern});
    },

    render() {
        const results = Object.assign({}, this.state, {
            getAnswer: this.getAnswer,
            setAnswer: this.setAnswer,
            save: this.save,
            mark: this.mark
        });

        return <ComposedComponent {...this.props} results={results}/>;
    }
});

export default ResultStore;