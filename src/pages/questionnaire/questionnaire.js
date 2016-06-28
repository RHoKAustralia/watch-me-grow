import React from 'react';
import Styles from './questionnaire.scss';
import QuestionSwitcher from './question-switcher/question-switcher';
import questions from '../../model/questions';
import ResultsStore from '../../model/result-store';

const Questionnaire = React.createClass({
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
      return !!ResultsStore.getAnswer(this.props.stores.results.results, question.questionnaire.id, question.id);
    }

    return false;
  },

  render() {
    return (
      <div className={Styles.questionnaire}>
        <div className={Styles.inner}>
          <QuestionSwitcher questionNumber={this.getQuestionNumber()} hasAnswered={this.hasAnswered()} />
          {React.Children.map(this.props.children, child => React.cloneElement(child, Object.assign({}, this.props, {
            questionNumber: this.getQuestionNumber()
          })))}
        </div>
      </div>
    );
  }
});

export default Questionnaire;