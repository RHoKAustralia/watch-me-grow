import React from "react";
import { Translation } from "react-i18next";
import i18next from "i18next";

import Switcher from "../../../common/switcher";
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

  text = (t: i18next.TFunction) => {
    if (this.props.questionNumber) {
      return `${this.props.questionNumber} ${t(
        "details.of"
      )} ${this.totalQuestionCount()}`;
    } else if (this.props.route === "consent") {
      return t("details.consent");
    } else {
      return t("details.personalDetails");
    }
  };

  render() {
    return (
      <Translation ns={["default"]}>
        {t => (
          <Switcher
            leftHref={this.leftHref()}
            leftDisabled={!this.leftHref().length}
            rightHref={this.rightHref()}
            rightDisabled={!this.rightHref().length}
            text={this.text(t)}
          />
        )}
      </Translation>
    );
  }
}

export default QuestionSwitcher;
