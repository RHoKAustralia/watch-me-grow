import React from 'react';
import Styles from './questionnaire.less';
import Card from '../../common/card/card';
import QuestionSwitcher from './question-switcher/question-switcher';

export default class LoginPage extends React.Component {
  render() {
    return (
      <div className={Styles.questionnaire}>
        <div className={Styles.inner}>
          <QuestionSwitcher />
          {this.props.children}
        </div>
      </div>
    );
  }
}
