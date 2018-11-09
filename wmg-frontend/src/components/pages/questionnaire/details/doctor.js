import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import { withRouter } from "react-router";

import Styles from "./details.module.scss";
import TextField from "@material-ui/core/TextField";
import DatePicker from "react-datepicker/dist/react-datepicker";

class Details extends React.Component {
  static propTypes = {
    details: PropTypes.object.isRequired
  };

  state = {};

  onSubmit = event => {
    event.preventDefault();

    if (this.props.details.validate()) {
      this.props.details.save();
      this.props.router.push("/questionnaire/questions/1");
    }
  };

  onChange = (propertyName, newValue) => {
    this.props.details.setState({ [propertyName]: newValue });
  };

  render() {
    const details = this.props.details;

    const inputTheme = {
      inputElement: Styles.inputElement
    };

    return (
      <form
        className={Styles.details}
        onSubmit={this.onSubmit}
        ref={form => (this.form = form)}
      >
        <div className={Styles.intro}>
          <p className={Styles.paragraph}>
            Please include your health practitioner’s email address if you would
            like them to receive these results.
          </p>

          <p className={Styles.paragraph}>
            Alternatively, the results will also be sent to you via email for
            you to print and take to your health professional.
          </p>
        </div>

        <TextField
          type="email"
          className={Styles.textBox}
          theme={{ ...inputTheme, label: Styles.label }}
          label="Your health practitioner's email address (optional)"
          value={details.doctorEmail}
          maxLength={100}
          error={details.errors.doctorEmail}
          onFocus={this.closeDatePicker}
          onChange={this.onChange.bind(this, "doctorEmail")}
        />
        <input type="submit" className={Styles.nextButton} value="Next" />
      </form>
    );
  }
}

export default withRouter(Details);
