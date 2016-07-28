import React from 'react';
import Styles from './questionnaire.scss';
import QuestionSwitcher from './question-switcher/question-switcher';
import questions from 'wmg-common/questions';

const Questionnaire = React.createClass({
    propTypes: {
        results: React.PropTypes.object,
        details: React.PropTypes.object
    },

    getQuestionNumber() {
        const questionNumber = parseInt(this.props.params.questionNumber);
        if (!Number.isNaN(questionNumber)) {
            return questionNumber;
        }
    },

    hasAnswered() {
        const questionNumber = this.getQuestionNumber();

        if (questionNumber) {
            const question = questions[questionNumber];
            return !!this.props.results.getAnswer(question.questionnaire.id, question.id);
        }

        return false;
    },

    render() {
        return (
            <div className={Styles.questionnaire}>
                <div className={Styles.inner}>
                    <QuestionSwitcher questionNumber={this.getQuestionNumber()}
                                      hasAnswered={this.hasAnswered()}
                                      details={this.props.details}/>
                    {React.Children.map(this.props.children, child => React.cloneElement(child, Object.assign({}, this.props, {
                        questionNumber: this.getQuestionNumber()
                    })))}
                </div>
            </div>
        );
    }
});

export default Questionnaire;
