import React from 'react';

import Styles from './question.less';

const Question = React.createClass({
  render() {
    return (
      <div className={Styles.question}>
        Do you have any concerns about your child's learning, development or behaviour?
      </div>
    );
  }
});

export default Question;