import React from 'react';
import Styles from './questionnaire.less';
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
          {React.Children.map(this.props.children, child => React.cloneElement(child, {
            stores: this.props.stores
          }))}
        </div>
      </div>
    );
  }
});

export default Questionnaire;