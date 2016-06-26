import React from 'react';
import classNames from 'classnames';
import {withRouter} from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import questions from '../../../model/questions';

import Styles from './question.scss'

const Question = React.createClass({
  componentWillMount() {
    this.processProps(this.props);
  },

  componentWillReceiveProps(newProps) {
    this.processProps(newProps);
  },

  processProps(props) {
    const oldQuestionNumber = this.questionNumber || 0;
    const newQuestionNumber = parseInt(props.params.questionNumber);

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

    this.goToNext();
  },

  goToNext() {
    const nextQuestionNumber = (this.questionNumber + 1);

    const nextRoute = nextQuestionNumber <= questions.length ?
      `/questionnaire/questions/${nextQuestionNumber}` :
      '/results';

    this.props.router.push(nextRoute);
  },

  render() {
    const question = this.question;

    return (
      <div className={classNames(Styles.root, {[Styles.reverse]: this.state.reverse})}>
        <ReactCSSTransitionGroup transitionName="fly" transitionEnterTimeout={200} transitionLeaveTimeout={200}>
          <div className={Styles.question} key={question.id}>
            <div className={Styles.text}>
              {question.text}
            </div>
            <div
              className={classNames(
                Styles.answers,
                {[Styles.answersVertical]: question.answers.length > 3}
              )}>
              <For each="answer" of={question.answers}>
                <button
                  key={answer.value}
                  className={Styles.button}
                  onClick={this.onAnswerClicked.bind(this, answer)}>
                  {answer.text}
                </button>
              </For>
            </div>
          </div>
        </ReactCSSTransitionGroup>
      </div>
    );
  }
});

export default withRouter(Question);