import React from 'react';
import moment from 'moment';
import {observer} from 'mobx-react';

import Styles from './details.less';
import Input from 'react-toolbox/lib/input';
import DatePicker from 'react-toolbox/lib/date_picker';

const Details = observer(React.createClass({
  render() {
    const detailsStore = this.props.stores.details;

    return (
      <div className={Styles.details}>
        <Input
          type="text"
          className={Styles.textBox}
          label="Your baby's name"
          value={detailsStore.babyName}
          maxLength={100}
          onChange={value => detailsStore.babyName = value}
        />
        <DatePicker
          type="text"
          className={Styles.textBox}
          label="Your baby's date of birth"
          value={detailsStore.babyDob && detailsStore.babyDob.toDate()}
          onChange={value => detailsStore.babyDob = moment(value)}
        />
        <Input
          type="text"
          className={Styles.textBox}
          label="Your name"
          value={detailsStore.parentName}
          maxLength={100}
          onChange={value => detailsStore.parentName = value}
        />
        <Input
          type="email"
          className={Styles.textBox}
          label="Your email address (so we can send you the results)"
          value={detailsStore.parentEmail}
          maxLength={100}
          onChange={value => detailsStore.parentEmail = value}
        />
        <a href="questionnaire/question/1" className={Styles.nextButton}>Next</a>
      </div>
    );
  }
}));

export default Details;