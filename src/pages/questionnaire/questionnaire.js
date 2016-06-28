import React from 'react';
import Styles from './questionnaire.scss';
import QuestionSwitcher from './question-switcher/question-switcher';
import questions from '../../model/questions';

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
      return !!this.props.stores.results.getAnswer(question.questionnaire.id, question.id);
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