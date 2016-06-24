import React from 'react';
import classNames from 'classnames';
import {withRouter} from 'react-router';

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
    this.questionNumber = parseInt(props.params.questionNumber);
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
      <div className={Styles.question}>
        <div className={Styles.text}>
          {question.text}
        </div>
        <div className={classNames(
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
    );
  }
});

export default withRouter(Question);