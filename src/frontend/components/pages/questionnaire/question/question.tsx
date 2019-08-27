import React, { DOMElement } from "react";
import classNames from "classnames";
import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import TextField, { OutlinedTextFieldProps } from "@material-ui/core/TextField";
import { Translation } from "react-i18next";

import { Results } from "src/frontend/components/stores/results-store";
import { RecordedAnswer } from "src/common/notify-function-input";
import { Question, Answer, Questionnaire } from "src/common/questionnaires";

import Styles from "./question.module.scss";

type Props = WithRouterProps & {
  questionNumber: number;
  results: Results;
  questions: { question: Question; questionnaire: Questionnaire }[];
};
type State = { reverse: boolean };

class QuestionComponent extends React.Component<Props, State> {
  questionNumber?: number;
  question?: { question: Question; questionnaire: Questionnaire };
  commentsElement = React.createRef<HTMLDivElement>();

  state: State = {
    reverse: false
  };

  processProps(props: Props) {
    const oldQuestionNumber = this.questionNumber || 0;
    const newQuestionNumber = props.questionNumber;

    this.setState({
      reverse: oldQuestionNumber > newQuestionNumber
    });

    this.questionNumber = newQuestionNumber;
    this.question = props.questions[this.questionNumber];
  }

  UNSAFE_componentWillMount() {
    this.processProps(this.props);
  }

  UNSAFE_componentWillReceiveProps(newProps: Props) {
    this.processProps(newProps);
  }

  onAnswerClicked = (
    answer: Answer,
    storedAnswer: RecordedAnswer,
    event: React.FormEvent
  ) => {
    event.preventDefault();
    const question = this.question;
    const resultStore = this.props.results;

    resultStore.setAnswer(
      question!.questionnaire.id,
      question!.question.id,
      answer.value,
      storedAnswer && storedAnswer.comments
    );

    if (!(this.question!.question.comments && answer.redFlagScore > 0)) {
      this.goToNext();
    } else {
      setTimeout(() => {
        this.commentsElement.current &&
          (this.commentsElement.current.querySelector(
            "textarea[name=Comments]"
          )! as HTMLTextAreaElement).focus();
      });
    }
  };

  onNextClicked = (event: React.MouseEvent) => {
    event.preventDefault();
    this.goToNext();
  };

  questionsLength = () => {
    return Object.keys(this.props.questions).length;
  };

  goToNext = () => {
    this.props.results.save();

    const nextQuestionNumber = this.questionNumber! + 1;
    const nextRoute =
      nextQuestionNumber <= this.questionsLength()
        ? `/questionnaire/questions/${nextQuestionNumber}`
        : "/result";

    this.props.router.push(nextRoute);
  };

  onCommentChanged = (storedAnswer: RecordedAnswer) => (event: any) => {
    const newValue = event.target.value;
    const question = this.question;
    const resultStore = this.props.results;

    resultStore.setAnswer(
      question!.questionnaire.id,
      question!.question.id,
      storedAnswer.value,
      newValue
    );
  };

  render() {
    const question = this.question;
    const resultsStore = this.props.results;
    const storedAnswer = resultsStore.getAnswer(
      question!.questionnaire.id,
      question!.question.id
    );
    const storedAnswerMetadata =
      storedAnswer &&
      question!.question.answers.find(
        answer => answer.value === storedAnswer.value
      );

    return (
      <Translation ns={["default"]}>
        {t => (
          <div
            className={classNames(Styles.root, {
              [Styles.reverse]: this.state.reverse
            })}
          >
            <ReactCSSTransitionGroup
              transitionName="fly"
              transitionEnterTimeout={200}
              transitionLeaveTimeout={200}
            >
              <div className={Styles.question} key={question!.question.id}>
                <div className={Styles.text}>
                  {t(question!.question.textId)}
                </div>
                <div className={Styles["answer-wrapper"]}>
                  <div
                    className={classNames(Styles.answers, {
                      [Styles["answers--vertical"]]:
                        question!.question.answers.length > 3
                    })}
                  >
                    {question!.question.answers.map(answer => (
                      <a
                        href="#"
                        key={answer.value}
                        className={classNames(Styles["answer-button"], {
                          [Styles["answer-button--current"]]:
                            storedAnswer && storedAnswer.value === answer.value
                        })}
                        onClick={this.onAnswerClicked.bind(
                          this,
                          answer,
                          storedAnswer
                        )}
                      >
                        {t(answer.textId)}
                      </a>
                    ))}
                  </div>
                </div>

                {storedAnswerMetadata && storedAnswerMetadata.redFlagScore > 0 && (
                  <React.Fragment>
                    <div className={Styles.comments} ref={this.commentsElement}>
                      <TextField
                        fullWidth={true}
                        type="text"
                        label="Can you briefly describe your concern?"
                        name="Comments"
                        value={(storedAnswer && storedAnswer.comments) || ""}
                        onChange={this.onCommentChanged(storedAnswer)}
                        inputProps={{ maxLength: 300 }}
                        multiline={true}
                      />
                    </div>
                    <div>
                      <a
                        href="#"
                        className={Styles["next-button"]}
                        onClick={this.onNextClicked}
                      >
                        {this.questionNumber! < this.questionsLength()
                          ? "Next"
                          : "Finish"}
                      </a>
                    </div>
                  </React.Fragment>
                )}
                {/* </div> */}
              </div>
            </ReactCSSTransitionGroup>
          </div>
        )}
      </Translation>
    );
  }
}

export default withRouter(QuestionComponent);
