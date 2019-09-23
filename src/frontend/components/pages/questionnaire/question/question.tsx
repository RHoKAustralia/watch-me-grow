import React from "react";
import classNames from "classnames";
import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import TextField from "@material-ui/core/TextField";
import { Translation } from "react-i18next";

import { Results } from "src/frontend/components/stores/results-store";
import { RecordedAnswer } from "src/common/notify-function-input";
import { Question, Answer, Questionnaire } from "src/common/questionnaires";
import QuestionnaireComponent from "../question-wrapper";
import { Details as DetailsStoreState } from "src/frontend/components/stores/details-store";

import Styles from "./question.module.scss";
import { QuestionLookup } from "src/common/questions";

type Props = WithRouterProps & {
  // questionNumber: number;
  results: Results;
  // questions: { question: Question; questionnaire: Questionnaire }[];
  details: DetailsStoreState;
};
type State = { reverse: boolean };

class QuestionComponent extends React.Component<Props, State> {
  commentsElement = React.createRef<HTMLDivElement>();

  state: State = {
    reverse: false
  };

  onAnswerClicked = (
    answer: Answer,
    storedAnswer: RecordedAnswer,
    question: {
      question: Question;
      questionnaire: Questionnaire;
    },
    questionNumber: number,
    questions: QuestionLookup
  ) => (event: React.FormEvent) => {
    event.preventDefault();
    const resultStore = this.props.results;

    resultStore.setAnswer(
      question.questionnaire.id,
      question.question.id,
      answer.value,
      storedAnswer && storedAnswer.comments
    );

    if (question.question.comments && answer.redFlagScore > 0) {
      setTimeout(() => {
        this.commentsElement.current &&
          (this.commentsElement.current.querySelector(
            "textarea[name=Comments]"
          )! as HTMLTextAreaElement).focus();
      });
    } else {
      this.goToNext(questionNumber, questions);
    }
  };

  onNextClicked = (questionNumber: number, questions: QuestionLookup) => (
    event: React.MouseEvent
  ) => {
    event.preventDefault();
    this.goToNext(questionNumber, questions);
  };

  questionsLength = (questions: QuestionLookup) => {
    return Object.keys(questions).length;
  };

  goToNext = (questionNumber: number, questions: QuestionLookup) => {
    this.props.results.save();

    const nextQuestionNumber = questionNumber! + 1;

    const [nextRoutePath, nextRouteAs] =
      nextQuestionNumber <= this.questionsLength(questions)
        ? [
            "/questionnaire/questions/[questionNumber]",
            `/questionnaire/questions/${nextQuestionNumber}`
          ]
        : ["/result", undefined];

    this.props.router.push(nextRoutePath, nextRouteAs);
  };

  onCommentChanged = (
    storedAnswer: RecordedAnswer,
    question: {
      question: Question;
      questionnaire: Questionnaire;
    }
  ) => (event: any) => {
    const newValue = event.target.value;
    const resultStore = this.props.results;

    resultStore.setAnswer(
      question.questionnaire.id,
      question.question.id,
      storedAnswer.value,
      newValue
    );
  };

  render() {
    return (
      <QuestionnaireComponent
        details={this.props.details}
        results={this.props.results}
      >
        {(questions, questionNumber) => {
          if (questions && questionNumber) {
            const question = questions[questionNumber];
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
                      <div
                        className={Styles.question}
                        key={question.question.id}
                      >
                        <div className={Styles.text}>
                          {t(question.question.textId)}
                        </div>
                        <div className={Styles["answer-wrapper"]}>
                          <div
                            className={classNames(Styles.answers, {
                              [Styles["answers--vertical"]]:
                                question!.question.answers.length > 3
                            })}
                          >
                            {question!.question.answers.map(answer => (
                              <button
                                key={answer.value}
                                className={classNames(Styles["answer-button"], {
                                  [Styles["answer-button--current"]]:
                                    storedAnswer &&
                                    storedAnswer.value === answer.value
                                })}
                                onClick={this.onAnswerClicked(
                                  answer,
                                  storedAnswer,
                                  question,
                                  questionNumber,
                                  questions
                                )}
                              >
                                {t(answer.textId)}
                              </button>
                            ))}
                          </div>
                        </div>

                        {question.question.comments &&
                          storedAnswerMetadata &&
                          storedAnswerMetadata.redFlagScore > 0 && (
                            <React.Fragment>
                              <div
                                className={Styles.comments}
                                ref={this.commentsElement}
                              >
                                <TextField
                                  fullWidth={true}
                                  type="text"
                                  label="Can you briefly describe your concern?"
                                  name="Comments"
                                  value={
                                    (storedAnswer && storedAnswer.comments) ||
                                    ""
                                  }
                                  onChange={this.onCommentChanged(
                                    storedAnswer,
                                    question
                                  )}
                                  inputProps={{ maxLength: 300 }}
                                  multiline={true}
                                />
                              </div>
                              <div>
                                <button
                                  className={Styles["next-button"]}
                                  onClick={this.onNextClicked(
                                    questionNumber,
                                    questions
                                  )}
                                >
                                  {questionNumber <
                                  this.questionsLength(questions)
                                    ? "Next"
                                    : "Finish"}
                                </button>
                              </div>
                            </React.Fragment>
                          )}
                      </div>
                    </ReactCSSTransitionGroup>
                  </div>
                )}
              </Translation>
            );
          } else {
            return "Fail";
          }
        }}
      </QuestionnaireComponent>
    );
  }
}

export default withRouter(QuestionComponent);
