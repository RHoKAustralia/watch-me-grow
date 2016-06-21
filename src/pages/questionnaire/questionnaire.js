import React from 'react';
import Styles from './questionnaire.scss';
import QuestionSwitcher from './question-switcher/question-switcher';

const Questionnaire = React.createClass({
  getQuestionNumber() {
    const questionNumber = parseInt(this.props.params.questionNumber);
    if (!Number.isNaN(questionNumber)) {
      return questionNumber;
    }
  },

  render() {
    return (
      <div className={Styles.questionnaire}>
        <div className={Styles.inner}>
          <QuestionSwitcher questionNumber={this.getQuestionNumber()}/>
          {React.Children.map(this.props.children, child => React.cloneElement(child, this.props))}
        </div>
      </div>
    );
  }
});

export default Questionnaire;