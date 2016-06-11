import React from 'react';
import Styles from './question-switcher.less';

const QuestionSwitcher = React.createClass({
  render() {
    return (
      <div className={Styles.questionSwitcher}>
        <button className={Styles.buttonLeft}>{'<'}</button>
        <span className={Styles.title}>Personal Details</span>
        <button className={Styles.buttonRight}>{'>'}</button>
      </div>
    );
  }
});

export default QuestionSwitcher;