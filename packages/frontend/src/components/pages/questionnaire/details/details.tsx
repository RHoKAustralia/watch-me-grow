import React, { FormEvent } from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import { withRouter, WithRouterProps } from "react-router";
import * as _ from "lodash";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import Styles from "./details.module.scss";
import TextField from "@material-ui/core/TextField";
import minMax from "@wmg/common/lib/min-max";
import questionnaires from "../../../../data/questionnaires";
import {
  Details as DetailsStoreState,
  PossibleValue as PossibleDetailsValue
} from "../../../stores/details-store";

const { minMonths, maxMonths } = questionnaires
  ? minMax(questionnaires)
  : { minMonths: 0, maxMonths: 0 };
const minDate = moment().subtract(maxMonths, "months");
const maxDate = moment().subtract(minMonths, "months");

type Props = { details: DetailsStoreState } & WithRouterProps;

class Details extends React.Component<Props, {}> {
  state = { showDatePicker: false };

  onSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (this.props.details.validate()) {
      this.props.details.save();
      this.props.router.push("/questionnaire/doctor");
    }
  };

  onChangeValue = (propertyName: PossibleDetailsValue, value: any) => {
    this.props.details.setState({ [propertyName]: value });
  };

  onChange = (
    propertyName: PossibleDetailsValue,
    event: React.ChangeEvent<any>
  ) => {
    this.onChangeValue(propertyName, event.currentTarget.value);
  };

  onDateClick = () => {
    this.setState({
      showDatePicker: true
    });
  };

  onDateChange = (value: moment.Moment) => {
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
      <form className={Styles.details} onSubmit={this.onSubmit}>
        <div className={Styles["field-wrapper"]}>
          <TextField
            type="text"
            className={Styles["text-box"]}
            label="Child's First Name"
            value={details.babyFirstName}
            error={!!details.errors.babyFirstName}
            inputProps={{ maxLength: 100 }}
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
            error={!!details.errors.babyLastName}
            inputProps={{ maxLength: 100 }}
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
            error={!!details.errors.babyGender}
            inputProps={{ maxLength: 100 }}
            fullWidth
            onFocus={this.closeDatePicker}
            onChange={this.onChange.bind(this, "babyGender")}
          />
        </div>
        <div className={Styles["field-wrapper"]}>
          <TextField
            inputProps={{ readOnly: true }}
            onFocus={this.onDateClick}
            label="Your child's date of birth"
            type="text"
            className={Styles["text-box"]}
            fullWidth
            value={details.babyDob ? details.babyDob.format("DD/MM/YYYY") : ""}
            error={!!details.errors.babyDob}
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
            inputProps={{ maxLength: 100 }}
            fullWidth
            error={!!details.errors.parentName}
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
            inputProps={{ maxLength: 100 }}
            fullWidth
            error={!!details.errors.parentEmail}
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

export default withRouter(Details);
