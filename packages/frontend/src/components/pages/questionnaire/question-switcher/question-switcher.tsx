import PropTypes from "prop-types";
import React from "react";
import { NamespacesConsumer } from "react-i18next";

import Switcher from "../../../common/switcher";
import questions from "@wmg/common/lib/questions";
import { Details as DetailsStoreState } from "../../../stores/details-store";
import { QuestionLookup } from "@wmg/common/lib/questions";

import Styles from "./question-switcher.module.scss";

type Props = {
  questionNumber: number;
  hasAnswered: boolean;
  details: DetailsStoreState;
  questions?: QuestionLookup;
  route?: string;
};

class QuestionSwitcher extends React.Component<Props> {
  totalQuestionCount = () => {
    return this.props.questions ? Object.keys(this.props.questions).length : 0;
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
      <NamespacesConsumer ns={["default"]}>
        {(t, { i18n, ready }) => (
          <Switcher
            leftHref={this.leftHref()}
            leftDisabled={!this.leftHref().length}
            rightHref={this.rightHref()}
            rightDisabled={!this.rightHref().length}
            text={
              this.props.questionNumber
                ? `${this.props.questionNumber} ${t(
                    "details.of"
                  )} ${this.totalQuestionCount()}`
                : t("details.personalDetails")
            }
          />
        )}
      </NamespacesConsumer>
    );
  }
}

export default QuestionSwitcher;
