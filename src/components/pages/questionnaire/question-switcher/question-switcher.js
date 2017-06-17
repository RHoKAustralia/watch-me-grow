import React from "react";

import Switcher from "../../../common/switcher";
import questions from "wmg-common/questions";

import Styles from "./question-switcher.scss";

const QuestionSwitcher = React.createClass({
  propTypes: {
    questionNumber: React.PropTypes.number,
    hasAnswered: React.PropTypes.bool.isRequired,
    details: React.PropTypes.object.isRequired
  },

  totalQuestionCount() {
    return Object.keys(this.props.questions).length;
  },

  leftHref() {
    if (this.props.questionNumber > 1) {
      return "/questionnaire/questions/" + (this.props.questionNumber - 1);
    } else if (this.props.questionNumber === 1) {
      return "/questionnaire/details";
    } else {
      return "";
    }
  },

  rightHref() {
    if (!this.props.questionNumber && this.props.details.validated) {
      return "/questionnaire/questions/1";
    } else if (
      this.props.hasAnswered &&
      this.props.questionNumber < this.totalQuestionCount()
    ) {
      return `/questionnaire/questions/${this.props.questionNumber + 1}`;
    } else {
      return "";
    }
  },

  render() {
    return (
      <Switcher
        leftHref={this.leftHref()}
        leftDisabled={!this.leftHref().length}
        rightHref={this.rightHref()}
        rightDisabled={!this.rightHref().length}
        text={
          this.props.questionNumber
            ? `${this.props.questionNumber} of ${this.totalQuestionCount()}`
            : `Personal Details`
        }
      />
    );
  }
});

export default QuestionSwitcher;
