import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import { withRouter } from "react-router";
import TextField from "@material-ui/core/TextField";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import Styles from "./question.module.scss";

class Question extends React.Component {
  static propTypes = {
    questionNumber: PropTypes.number.isRequired,
    results: PropTypes.object.isRequired
  };

  state = {
    reverse: false
  };

  UNSAFE_componentWillMount() {
    this.processProps(this.props);
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    this.processProps(newProps);
  }

  processProps = props => {
    const oldQuestionNumber = this.questionNumber || 0;
    const newQuestionNumber = props.questionNumber;

    this.setState({
      reverse: oldQuestionNumber > newQuestionNumber
    });

    this.questionNumber = newQuestionNumber;
    this.question = props.questions[this.questionNumber];
  };

  onAnswerClicked = (answer, storedAnswer, event) => {
    event.preventDefault();
    const question = this.question;
    const resultStore = this.props.results;

    resultStore.setAnswer(
      question.questionnaire.id,
      question.id,
      answer.value,
      storedAnswer && storedAnswer.comments
    );

    if (
      !(
        this.question.comments &&
        (answer.redFlagQuestion || answer.amberFlagQuestion)
      )
    ) {
      this.goToNext();
    } else {
      setTimeout(() =>
        ReactDOM.findDOMNode(this.commentsElement)
          .querySelector("textarea")
          .focus()
      );
    }
  };

  onNextClicked = event => {
    event.preventDefault();
    this.goToNext();
  };

  questionsLength = () => {
    return Object.keys(this.props.questions).length;
  };

  goToNext = () => {
    this.props.results.save();

    const nextQuestionNumber = this.questionNumber + 1;
    const nextRoute =
      nextQuestionNumber <= this.questionsLength()
        ? `/questionnaire/questions/${nextQuestionNumber}`
        : "/result";

    this.props.router.push(nextRoute);
  };

  onCommentChanged = (storedAnswer, newValue) => {
    const question = this.question;
    const resultStore = this.props.results;

    resultStore.setAnswer(
      question.questionnaire.id,
      question.id,
      storedAnswer.value,
      newValue
    );
  };

  render() {
    const question = this.question;
    const resultsStore = this.props.results;
    const storedAnswer = resultsStore.getAnswer(
      question.questionnaire.id,
      question.id
    );

    return (
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
          <div className={Styles.question} key={question.id}>
            <div className={Styles.text}>{question.text}</div>
            <div className={Styles.answerWrapper}>
              <div
                className={classNames(Styles.answers, {
                  [Styles.answersVertical]: question.answers.length > 3
                })}
              >
                {question.answers.map(answer => (
                  <a
                    href="#"
                    key={answer.value}
                    className={classNames(Styles.answerButton, {
                      [Styles.answerButtonCurrent]:
                        storedAnswer && storedAnswer.value === answer.value
                    })}
                    onClick={this.onAnswerClicked.bind(
                      this,
                      answer,
                      storedAnswer
                    )}
                  >
                    {answer.text}
                  </a>
                ))}
              </div>
            </div>

            <div
              style={{
                display: question.comments && storedAnswer ? "block" : "none"
              }}
            >
              <TextField
                ref={ref => (this.commentsElement = ref)}
                className={Styles.comments}
                type="text"
                label="Can you briefly describe your concern?"
                name="Comments"
                value={(storedAnswer && storedAnswer.comments) || ""}
                onChange={this.onCommentChanged.bind(this, storedAnswer)}
                maxLength={300}
                multiline={true}
                theme={{
                  inputElement: Styles.commentsTextarea
                }}
              />
              <a
                href="#"
                className={Styles.nextButton}
                onClick={this.onNextClicked}
              >
                {this.questionNumber < this.questionsLength()
                  ? "Next"
                  : "Finish"}
              </a>
            </div>
          </div>
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

export default withRouter(Question);
