import React from 'react';
import {observer} from 'mobx-react';
import moment from 'moment';
import {withRouter} from 'react-router';

import Styles from './details.scss';
import Input from 'react-toolbox/lib/input';
import DatePicker from 'react-toolbox/lib/date_picker';

const Details = observer(React.createClass({
  onSubmit(event) {
    event.preventDefault();
    
    if (this.props.stores.details.validate()) {
      this.props.stores.details.save();
      this.props.router.push('/questionnaire/questions/1');
    }
  },
  
  render() {
    const detailsStore = this.props.stores.details;

    return (
      <form className={Styles.details} onSubmit={this.onSubmit}>
        <Input
          type="text"
          className={Styles.textBox}
          label="Your baby's name"
          value={detailsStore.babyName}
          error={detailsStore.errors.babyName}
          maxLength={100}
          onChange={value => detailsStore.babyName = value}
        />
        <DatePicker
          type="text"
          className={Styles.textBox}
          label="Your baby's date of birth"
          value={detailsStore.babyDob && detailsStore.babyDob.toDate()}
          error={detailsStore.errors.babyDob}
          onChange={value => detailsStore.babyDob = moment(value)}
        />
        <Input
          type="text"
          className={Styles.textBox}
          label="Your name"
          value={detailsStore.parentName}
          maxLength={100}
          error={detailsStore.errors.parentName}
          onChange={value => detailsStore.parentName = value}
        />
        <Input
          type="email"
          className={Styles.textBox}
          label="Your email address (so we can send you the results)"
          value={detailsStore.parentEmail}
          maxLength={100}
          error={detailsStore.errors.parentEmail}
          onChange={value => detailsStore.parentEmail = value}
        />
        <button className={Styles.nextButton} type="submit">
          Next
        </button>
      </form>
    );
  }
}));

export default withRouter(Details);