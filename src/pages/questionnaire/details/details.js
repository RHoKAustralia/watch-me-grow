import React from 'react';

import Styles from './details.less';
import Input from 'react-toolbox/lib/input';
import DatePicker from 'react-toolbox/lib/date_picker';
import {Button} from 'react-toolbox/lib/button';

const Details = React.createClass({
  render() {
    return (
      <div className={Styles.details}>
        <Input
          type="text"
          className={Styles.textBox}
          label="Your baby's name"
        />
        <DatePicker
          type="text"
          className={Styles.textBox}
          label="Your baby's date of birth"
        />
        <Input
          type="text"
          className={Styles.textBox}
          label="Your name"
        />
        <Input
          type="text"
          className={Styles.textBox}
          label="Your email address (so we can send you the results)"
        />
        <a href="questionnaire/question" className={Styles.nextButton}>Next</a>
      </div>
    );
  }
});

export default Details;