import React from 'react';
import Styles from './question-switcher.less';

const QuestionSwitcher = React.createClass({
  render() {
    return (
      <div className={Styles.questionSwitcher}>
        <button className={Styles.buttonLeft}>
          <i className="material-icons">chevron_left</i>
        </button>
        <span className={Styles.title}>Personal Details</span>
        <button className={Styles.buttonRight}>
          <i className="material-icons">chevron_right</i>
        </button>
      </div>
    );
  }
});

export default QuestionSwitcher;