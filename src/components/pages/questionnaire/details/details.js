import React from 'react';
import moment from 'moment';
import {withRouter} from 'react-router';

import Styles from './details.scss';
import Input from 'react-toolbox/lib/input';
import DatePicker from 'react-toolbox/lib/date_picker';

const Details = React.createClass({
  propTypes: {
    details: React.PropTypes.object.isRequired
  },

  onSubmit(event) {
    event.preventDefault();

    if (this.props.details.validate()) {
      this.props.details.save();
      this.props.router.push('/questionnaire/questions/1');
    }
  },

  onChange(propertyName, newValue) {
    this.props.details.setState({[propertyName]: newValue});
  },

  render() {
    const details = this.props.details;

    return (
      <form className={Styles.details} onSubmit={this.onSubmit}>
        <Input
          type="text"
          className={Styles.textBox}
          label="Your baby's name"
          value={details.babyName}
          error={details.errors.babyName}
          maxLength={100}
          onChange={this.onChange.bind(this, 'babyName')}
        />
        <DatePicker
          type="text"
          className={Styles.textBox}
          label="Your baby's date of birth"
          value={details.babyDob && details.babyDob.toDate()}
          error={details.errors.babyDob}
          onChange={value => this.onChange('babyDob', moment(value))}
        />
        <Input
          type="text"
          className={Styles.textBox}
          label="Your name"
          value={details.parentName}
          maxLength={100}
          error={details.errors.parentName}
          onChange={this.onChange.bind(this, 'parentName')}
        />
        <Input
          type="email"
          className={Styles.textBox}
          label="Your email address (so we can send you the results)"
          value={details.parentEmail}
          maxLength={100}
          error={details.errors.parentEmail}
          onChange={this.onChange.bind(this, 'parentEmail')}
        />
        <button className={Styles.nextButton} type="submit">
          Next
        </button>
      </form>
    );
  }
});

export default withRouter(Details);