import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import {withRouter} from 'react-router';
import Input from 'react-toolbox/lib/input';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import questions from 'wmg-common/questions';
const questionsLength = Object.keys(questions).length;

import Styles from './question.scss'

const Question = React.createClass({
  propTypes: {
    questionNumber: React.PropTypes.number.isRequired,
    results: React.PropTypes.object.isRequired
  },

  getInitialState() {
    return {
      reverse: false
    };
  },

  componentWillMount() {
    this.processProps(this.props);
  },

  componentWillReceiveProps(newProps) {
    this.processProps(newProps);
  },

  processProps(props) {
    const oldQuestionNumber = this.questionNumber || 0;
    const newQuestionNumber = props.questionNumber;

    this.setState({
      reverse: oldQuestionNumber > newQuestionNumber
    });

    this.questionNumber = newQuestionNumber;
    this.question = questions[this.questionNumber];
  },

  onAnswerClicked(answer, storedAnswer, event) {
    const question = this.question;
    const resultStore = this.props.results;

    resultStore.setAnswer(question.questionnaire.id, question.id, answer.value, storedAnswer && storedAnswer.comments);

    if (!(this.question.comments && (answer.redFlagQuestion || answer.amberFlagQuestion))) {
      this.goToNext();
    } else {
      setTimeout(() => ReactDOM.findDOMNode(this.commentsElement).querySelector('textarea').focus());
    }
  },

  goToNext() {
    this.props.results.save();

    const nextQuestionNumber = (this.questionNumber + 1);
    const nextRoute = nextQuestionNumber <= questionsLength ?
      `/questionnaire/questions/${nextQuestionNumber}` :
      '/result';

    this.props.router.push(nextRoute);
  },

  onCommentChanged(storedAnswer, newValue) {
    const question = this.question;
    const resultStore = this.props.results;

    resultStore.setAnswer(question.questionnaire.id, question.id, storedAnswer.value, newValue);
  },

  render() {
    const question = this.question;
    const resultsStore = this.props.results;
    const storedAnswer = resultsStore.getAnswer(question.questionnaire.id, question.id);

    return (
      <div className={classNames(Styles.root, {[Styles.reverse]: this.state.reverse})}>
        <ReactCSSTransitionGroup transitionName="fly" transitionEnterTimeout={200} transitionLeaveTimeout={200}>
          <div className={Styles.question} key={question.id}>
            <div className={Styles.text}>
              {question.text}
            </div>
            <div className={Styles.answerWrapper}>
              <div
                className={classNames(
                Styles.answers,
                {[Styles.answersVertical]: question.answers.length > 3}
              )}>
                <For each="answer" of={question.answers}>
                  <input
                    key={answer.value}
                    className={classNames(
                      Styles.answerButton,
                      {[Styles.answerButtonCurrent]: storedAnswer && storedAnswer.value === answer.value}
                    )}
                    onClick={this.onAnswerClicked.bind(this, answer, storedAnswer)}
                    value={answer.text} />
                </For>
              </div>
            </div>

            <div style={{display: question.comments && storedAnswer ? 'block' : 'none'}}>
              <Input
                ref={ref => this.commentsElement = ref}
                className={Styles.comments}
                type="text"
                label="Can you briefly describe your concern?"
                name="Comments"
                value={(storedAnswer && storedAnswer.comments) || ''}
                onChange={this.onCommentChanged.bind(this, storedAnswer)}
                maxLength={300}
                multiline={true}
                theme={{
                  inputElement: Styles.commentsTextarea
                }}
              />
              <input
                type="button"
                className={Styles.nextButton}
                onClick={this.goToNext}
                readOnly
                value={this.questionNumber < questionsLength ? 'Next': 'Finish'}>
              </input>
            </div>
          </div>
        </ReactCSSTransitionGroup>
      </div>
    );
  }
});

export default withRouter(Question);
