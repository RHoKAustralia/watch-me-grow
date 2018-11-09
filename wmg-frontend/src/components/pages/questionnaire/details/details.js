import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import { withRouter } from "react-router";
import _ from "lodash";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

// import "./react-datepicker-with-em.scss";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import Styles from "./details.module.scss";
import TextField from "@material-ui/core/TextField";
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

  onChangeValue = (propertyName, value) => {
    this.props.details.setState({ [propertyName]: value });
  };

  onChange = (propertyName, event) => {
    this.onChangeValue(propertyName, event.target.value);
  };

  onDateClick = () => {
    this.setState({
      showDatePicker: true
    });
  };

  onDateChange = value => {
    this.closeDatePicker();
    this.onChangeValue("babyDob", value);
  };

  closeDatePicker = () => {
    this.setState({
      showDatePicker: false
    });
  };

  render() {
    const details = this.props.details;

    return (
      <form
        className={Styles.details}
        onSubmit={this.onSubmit}
        ref={form => (this.form = form)}
      >
        <div className={Styles["field-wrapper"]}>
          <FormControl fullWidth>
            <InputLabel htmlFor="location">Location</InputLabel>
            <Select
              native
              fullWidth
              value={this.state.age}
              onChange={this.onChange.bind(this, "location")}
              error={details.errors.location}
              onFocus={this.closeDatePicker}
              inputProps={{
                name: "location",
                id: "location"
              }}
            >
              <option value="" />
              {locations.map(location => (
                <option value={location.value}>{location.label}</option>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className={Styles["field-wrapper"]}>
          <TextField
            type="text"
            className={Styles["text-box"]}
            label="Child's First Name"
            value={details.babyFirstName}
            error={details.errors.babyFirstName}
            maxLength={100}
            fullWidth
            onFocus={this.closeDatePicker}
            onChange={this.onChange.bind(this, "babyFirstName")}
          />
        </div>
        <div className={Styles["field-wrapper"]}>
          <TextField
            type="text"
            className={Styles["text-box"]}
            label="Child's Last Name"
            value={details.babyLastName}
            error={details.errors.babyLastName}
            maxLength={100}
            fullWidth
            onFocus={this.closeDatePicker}
            onChange={this.onChange.bind(this, "babyLastName")}
          />
        </div>
        <div className={Styles["field-wrapper"]}>
          <TextField
            type="text"
            className={Styles["text-box"]}
            label="Gender"
            value={details.babyGender}
            error={details.errors.babyGender}
            maxLength={100}
            fullWidth
            onFocus={this.closeDatePicker}
            onChange={this.onChange.bind(this, "babyGender")}
          />
        </div>
        <div className={Styles["field-wrapper"]}>
          <TextField
            readOnly="true"
            onFocus={this.onDateClick}
            ref={input => (this.input = input)}
            label="Your child's date of birth"
            type="text"
            className={Styles["text-box"]}
            fullWidth
            value={details.babyDob ? details.babyDob.format("DD/MM/YYYY") : ""}
            error={details.errors.babyDob}
          />
        </div>
        <div className={Styles["field-wrapper"]}>
          {this.state.showDatePicker && (
            <DatePicker
              inline
              showYearDropdown
              minDate={minDate}
              maxDate={maxDate}
              selected={details.babyDob}
              onChange={this.onDateChange}
            />
          )}
        </div>
        <div className={Styles["field-wrapper"]}>
          <TextField
            type="text"
            className={Styles["text-box"]}
            label="Your name"
            value={details.parentName}
            maxLength={100}
            fullWidth
            error={details.errors.parentName}
            onFocus={this.closeDatePicker}
            onChange={this.onChange.bind(this, "parentName")}
          />
        </div>
        <div className={Styles["field-wrapper"]}>
          <TextField
            type="email"
            className={Styles["text-box"]}
            label="Your email address (so we can send you the results)"
            value={details.parentEmail}
            maxLength={100}
            fullWidth
            error={details.errors.parentEmail}
            onFocus={this.closeDatePicker}
            onChange={this.onChange.bind(this, "parentEmail")}
          />
        </div>
        <div>
          <input type="submit" className={Styles["next-button"]} value="Next" />
        </div>
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
      />
    );
  }
}

export default withRouter(Details);
