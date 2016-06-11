import React from 'react';
import Styles from './questionnaire.less';
import Card from '../../common/card/card';
import QuestionSwitcher from './question-switcher/question-switcher';

export default class LoginPage extends React.Component {
  render() {
    return (
      <Card className={Styles.content} fullWidth={true}>
        <QuestionSwitcher />
        Hello
      </Card>
    );
  }
}
