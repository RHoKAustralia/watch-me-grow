import React from 'react';
import {Link} from 'react-router';
import classNames from 'classnames';
import Styles from './question-switcher.scss';

const QuestionSwitcher = React.createClass({
  propTypes: {
    questionNumber: React.PropTypes.number
  },

  leftHref() {
    if (this.props.questionNumber > 1) {
      return '/questionnaire/questions/' + (this.props.questionNumber - 1);
    } else if (this.props.questionNumber === 1) {
      return '/questionnaire/details';
    } else {
      return '';
    }
  },

  rightHref() {
    return '/questionnaire/questions/' +
      (typeof this.props.questionNumber === 'undefined' ? 1 : this.props.questionNumber + 1);
  },

  render() {
    return (
      <div className={Styles.questionSwitcher}>
        <Link
          to={this.leftHref()}
          className={classNames(
            Styles.buttonLeft,
            {[Styles.buttonDisabled]: !this.leftHref().length}
          )}>
          <i className="material-icons">chevron_left</i>
        </Link>
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
        <Link
          className={classNames(
            Styles.buttonRight,
            {[Styles.buttonDisabled]: !this.rightHref().length}
          )}
          to={this.rightHref()}>
          <i className="material-icons">chevron_right</i>
        </Link>
      </div>
    );
  }
});

export default QuestionSwitcher;