import React, { ReactNode } from "react";
import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import Styles from "./questionnaire.module.scss";

import QuestionSwitcher from "./question-switcher/question-switcher";
import getQuestions from "src/frontend/data/questions";
import { QuestionLookup } from "src/common/questions";
import { Details } from "src/frontend/components/stores/details-store";
import { Results } from "src/frontend/components/stores/results-store";

type Props = {
  details: Details;
  results: Results;
  children: (questions: QuestionLookup, questionNumber: number) => ReactNode;
} & WithRouterProps;

type State = {
  questions?: QuestionLookup;
};

class Questionnaire extends React.Component<Props, State> {
  state: State = {};

  UNSAFE_componentWillMount() {
    this.updateQuestions(this.props);
  }

  UNSAFE_componentWillReceiveProps(props: Props) {
    this.updateQuestions(props);
  }

  updateQuestions = (props: Props) => {
    if (this.props.details.babyDob) {
      this.setState({
        questions: getQuestions(this.props.details.ageInMonths())
      });
    }
  };

  getQuestionNumber = () => {
    const questionNumber =
      this.props.router.query.questionNumber &&
      parseInt(this.props.router.query.questionNumber[0]);
    if (!Number.isNaN(questionNumber)) {
      return questionNumber;
    } else {
      return 0;
    }
  };

  hasAnswered = () => {
    const questionNumber = this.getQuestionNumber();

    if (questionNumber) {
      const question = this.state.questions![questionNumber];
      return !!this.props.results.getAnswer(
        question.questionnaire.id,
        question.question.id
      );
    }

    return false;
  };

  render() {
    return (
      <div className={Styles.questionnaire}>
        <div className={Styles.inner}>
          <QuestionSwitcher
            questions={this.state.questions}
            questionNumber={this.getQuestionNumber()}
            hasAnswered={this.hasAnswered()}
            details={this.props.details}
          />
          {this.props.children(this.state.questions, this.getQuestionNumber())}
        </div>
      </div>
    );
  }
}

export default withRouter(Questionnaire);
