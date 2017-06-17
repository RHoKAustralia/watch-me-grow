import React from "react";
import Styles from "./questionnaire.scss";
import QuestionSwitcher from "./question-switcher/question-switcher";
import getQuestions from "wmg-common/questions";
import moment from 'moment';

const Questionnaire = React.createClass({
  propTypes: {
    results: React.PropTypes.object,
    details: React.PropTypes.object
  },

  componentWillMount() {
    this.updateQuestions(this.props);
  },

  componentWillRecieveProps(props) {
    this.updateQuestions(props);
  },

  updateQuestions(props) {    
    const months = moment().diff(this.props.details.babyDob, 'months');

    this.setState({
      questions: getQuestions(months)
    });
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
      const question = this.questions[questionNumber];
      return !!this.props.results.getAnswer(
        question.questionnaire.id,
        question.id
      );
    }

    return false;
  },

  render() {
    return (
      <div className={Styles.questionnaire}>
        <div className={Styles.inner}>
          <QuestionSwitcher
            questions={this.questions}
            questionNumber={this.getQuestionNumber()}
            hasAnswered={this.hasAnswered()}
            details={this.props.details}
          />
          {React.Children.map(this.props.children, child =>
            React.cloneElement(
              child,
              Object.assign({}, this.props, {
                questionNumber: this.getQuestionNumber()
              })
            )
          )}
        </div>
      </div>
    );
  }
});

export default Questionnaire;
