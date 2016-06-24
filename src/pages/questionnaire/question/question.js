import React from 'react';
import classNames from 'classnames';

import questions from '../../../model/questions';

import Styles from './question.scss'

const Question = React.createClass({
  render() {
    const question = questions[this.props.params.questionNumber];

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
            <button className={Styles.button}>
              {answer.text}
            </button>
          </For>
        </div>
      </div>
    );
  }
});

export default Question;