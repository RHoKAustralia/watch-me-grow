import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import { withRouter } from "react-router";
import _ from "lodash";

import "./react-datepicker-with-em.scss";
import Styles from "./details.module.scss";
import TextField from "@material-ui/core/TextField";
// import Dropdown from "react-toolbox/lib/dropdown";
import DatePicker from "react-datepicker/dist/react-datepicker";
import questionnairesForSubsite from "wmg-common/questionnaires-for-subsite";
import minMax from "wmg-common/min-max";

const questionnaires = _(questionnairesForSubsite(process.env.SUBSITE));
const { minMonths, maxMonths } = minMax(questionnaires);
const minDate = moment().subtract(maxMonths, "months");
const maxDate = moment().subtract(minMonths, "months");

const locations = [
  "WMG - E",
  "WMG - REAL",
  "Childcare - Rockdale",
  "GP - Rockdale",
  "Playgroup - Botany",
  "Other"
].map(value => ({ value, label: value }));

class Details extends React.Component {
  static propTypes = {
    details: PropTypes.object.isRequired
  };

  state = {};

  onSubmit = event => {
    event.preventDefault();

    if (this.props.details.validate()) {
      this.props.details.save();
      this.props.router.push("/questionnaire/doctor");
    }
  };

  onChange = (propertyName, newValue) => {
    this.props.details.setState({ [propertyName]: newValue });
  };

  onDateClick = () => {
    this.setState({
      showDatePicker: true
    });
  };

  onDateChange = value => {
    this.closeDatePicker();
    this.onChange("babyDob", value);
  };

  closeDatePicker = () => {
    this.setState({
      showDatePicker: false
    });
  };

  render() {
    const details = this.props.details;

    const inputTheme = {
      inputElement: Styles["input-element"]
    };

    return (
      <form
        className={Styles.details}
        onSubmit={this.onSubmit}
        ref={form => (this.form = form)}
      >
        {/* <Dropdown
          auto
          source={locations}
          label="Location"
          theme={inputTheme}
          value={details.location}
          error={details.errors.location}
          onFocus={this.closeDatePicker}
          onChange={this.onChange.bind(this, "location")}
        /> */}
        <TextField
          type="text"
          className={Styles["text-box"]}
          theme={inputTheme}
          label="Child's First Name"
          value={details.babyFirstName}
          error={details.errors.babyFirstName}
          maxLength={100}
          onFocus={this.closeDatePicker}
          onChange={this.onChange.bind(this, "babyFirstName")}
        />
        <TextField
          type="text"
          className={Styles["text-box"]}
          theme={inputTheme}
          label="Child's Last Name"
          value={details.babyLastName}
          error={details.errors.babyLastName}
          maxLength={100}
          onFocus={this.closeDatePicker}
          onChange={this.onChange.bind(this, "babyLastName")}
        />
        <TextField
          type="text"
          className={Styles["text-box"]}
          theme={inputTheme}
          label="Gender"
          value={details.babyGender}
          error={details.errors.babyGender}
          maxLength={100}
          onFocus={this.closeDatePicker}
          onChange={this.onChange.bind(this, "babyGender")}
        />
        <TextField
          readOnly="true"
          onFocus={this.onDateClick}
          ref={input => (this.input = input)}
          label="Your child's date of birth"
          type="text"
          className={Styles["text-box"]}
          theme={inputTheme}
          value={details.babyDob ? details.babyDob.format("DD/MM/YYYY") : ""}
          error={details.errors.babyDob}
        />
        {this.state.showDatePicker && (
          <DatePicker
            inline
            showYearDropdown
            className={Styles["date-picker"]}
            minDate={minDate}
            maxDate={maxDate}
            selected={details.babyDob}
            onChange={this.onDateChange}
          />
        )}
        <TextField
          type="text"
          className={Styles["text-box"]}
          theme={inputTheme}
          label="Your name"
          value={details.parentName}
          maxLength={100}
          error={details.errors.parentName}
          onFocus={this.closeDatePicker}
          onChange={this.onChange.bind(this, "parentName")}
        />
        <TextField
          type="email"
          className={Styles["text-box"]}
          theme={{ ...inputTheme, label: Styles.label }}
          label="Your email address (so we can send you the results)"
          value={details.parentEmail}
          maxLength={100}
          error={details.errors.parentEmail}
          onFocus={this.closeDatePicker}
          onChange={this.onChange.bind(this, "parentEmail")}
        />
        <input type="submit" className={Styles.nextButton} value="Next" />
      </form>
    );
  }
}

class DatePickerInput extends React.Component {
  render() {
    const inputTheme = {
      inputElement: Styles.inputElement
    };

    return (
      <TextField
        {...this.props}
        readOnly="true"
        ref={input => (this.input = input)}
        label="Your child's date of birth"
        type="text"
        className={Styles["text-box"]}
        theme={inputTheme}
      />
    );
  }
}

export default withRouter(Details);
