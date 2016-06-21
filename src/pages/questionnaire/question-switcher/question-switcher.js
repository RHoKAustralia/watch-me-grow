import React from 'react';
import Styles from './question-switcher.less';

const QuestionSwitcher = React.createClass({
  propTypes: {
    questionNumber: React.PropTypes.number
  },

  leftHref() {
    if (this.props.questionNumber > 1) {
      return 'questionnaire/question/' + this.props.questionNumber - 1;
    } else if (this.props.questionNumber === 1) {
      return 'questionnaire/details';
    }
  },

  rightHref() {

  },

  render() {
    return (
      <div className={Styles.questionSwitcher}>
        <a className={Styles.buttonLeft}>
          <i className="material-icons">chevron_left</i>
        </a>
        <span className={Styles.title}>
          <Choose>
            <When condition={this.props.questionNumber}>
              {this.props.questionNumber}
            </When>
            <Otherwise>
              Personal Details
            </Otherwise>
          </Choose>
        </span>
        <a className={Styles.buttonRight}>
          <i className="material-icons">chevron_right</i>
        </a>
      </div>
    );
  }
});

export default QuestionSwitcher;