import React from 'react';
import classNames from 'classnames';
import {withRouter} from 'react-router';
import {observer} from 'mobx-react';
import Input from 'react-toolbox/lib/input';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ResultsStore from '../../../model/result-store';

import questions from '../../../model/questions';

import Styles from './question.scss'

const Question = React.createClass({
  propTypes: {
    questionNumber: React.PropTypes.number.isRequired
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

  onAnswerClicked(answer, event) {
    const question = this.question;
    const resultStore = this.props.stores.results;

    resultStore.saveAnswer(question.questionnaire.id, question.id, answer.value);

    if (!(this.question.comments && (answer.redFlagQuestion || answer.amberFlagQuestion))) {
      this.goToNext();
    }
  },

  goToNext() {
    const nextQuestionNumber = (this.questionNumber + 1);
    const questionsLength = Object.keys(questions).length;
    const nextRoute = nextQuestionNumber <= questionsLength ?
      `/questionnaire/questions/${nextQuestionNumber}` :
      '/results';

    this.props.router.push(nextRoute);
  },

  render() {
    const question = this.question;
    this.props.stores.results.results.blah;
    const storedAnswer = ResultsStore.getAnswer(this.props.stores.results.results, question.questionnaire.id, question.id);

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
                  <button
                    key={answer.value}
                    className={classNames(
                    Styles.answerButton,
                    {[Styles.answerButtonCurrent]: storedAnswer && storedAnswer.value === answer.value}
                  )}
                    onClick={this.onAnswerClicked.bind(this, answer)}>
                    {answer.text}
                  </button>
                </For>
              </div>
            </div>

            <If condition={question.comments && storedAnswer}>
              <Input
                ref={ref => this.commentsElement = ref}
                className={Styles.comments}
                type="text"
                label="Can you briefly describe your concern?"
                name="Comments"
                value={storedAnswer.comments || ''}
                onChange={this.onCommentChanged}
                maxLength={300}
                multiline={true}
                theme={{
                  inputElement: Styles.commentsTextarea
                }}
              />
              <button
                className={Styles.nextButton}
                onClick={this.goToNext}>
                Next
              </button>
            </If>
          </div>
        </ReactCSSTransitionGroup>
      </div>
    );
  }
});

export default withRouter(observer(Question));