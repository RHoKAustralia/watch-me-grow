import React from "react";
import moment from "moment";
import { RouteProps } from "react-router";

import Styles from "./questionnaire.module.scss";

import QuestionSwitcher from "./question-switcher/question-switcher";
import getQuestions from "../../../data/questions";
import { QuestionLookup } from "@wmg/common/lib/questions";
import questionnaires from "../../../data/questionnaires";
import { Details } from "../../stores/details-store";

type Props = {
  details: Details;
  results: any;
  params: {
    questionNumber: string;
  };
  routes: RouteProps[];
};

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
    const questionNumber = parseInt(this.props.params.questionNumber);
    if (!Number.isNaN(questionNumber)) {
      return questionNumber;
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
            route={this.props.routes[this.props.routes.length - 1].path}
          />
          {React.Children.map(this.props.children, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(
                child,
                Object.assign({}, this.props, {
                  questions: this.state.questions,
                  questionNumber: this.getQuestionNumber()
                })
              );
            }
          })}
        </div>
      </div>
    );
  }
}

export default Questionnaire;
