import PropTypes from "prop-types";
import React from "react";

import Switcher from "../../../common/switcher";
import questions from "wmg-common/questions";

import Styles from "./question-switcher.module.scss";

class QuestionSwitcher extends React.Component {
  static propTypes = {
    questionNumber: PropTypes.number,
    hasAnswered: PropTypes.bool.isRequired,
    details: PropTypes.object.isRequired
  };

  totalQuestionCount = () => {
    return Object.keys(this.props.questions).length;
  };

  leftHref = () => {
    if (this.props.questionNumber > 1) {
      return "/questionnaire/questions/" + (this.props.questionNumber - 1);
    } else if (this.props.questionNumber === 1) {
      return "/questionnaire/doctor";
    } else if (this.props.route === "doctor") {
      return "/questionnaire/details";
    } else {
      return "";
    }
  };

  rightHref = () => {
    if (
      !this.props.questionNumber &&
      this.props.details.validated &&
      this.props.route === "details"
    ) {
      return "/questionnaire/doctor";
    } else if (
      this.props.hasAnswered &&
      this.props.questionNumber < this.totalQuestionCount()
    ) {
      return `/questionnaire/questions/${this.props.questionNumber + 1}`;
    } else if (this.props.route === "doctor") {
      return "/questionnaire/questions/1";
    } else {
      return "";
    }
  };

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
}

export default QuestionSwitcher;
