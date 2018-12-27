import React, { FormEvent } from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import { withRouter, WithRouterProps } from "react-router";

import {
  Details as DetailsStoreState,
  PossibleValue as PossibleDetailsValue
} from "../../../stores/details-store";
import Styles from "./details.module.scss";
import TextField from "@material-ui/core/TextField";

type Props = { details: DetailsStoreState } & WithRouterProps;

class Doctor extends React.Component<Props, {}> {
  state = {};

  onSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (this.props.details.validate()) {
      this.props.details.save();
      this.props.router.push("/questionnaire/questions/1");
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

  render() {
    const details = this.props.details;

    const inputTheme = {
      inputElement: Styles.inputElement
    };

    return (
      <form className={Styles.details} onSubmit={this.onSubmit}>
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

        <div className={Styles["field-wrapper"]}>
          <TextField
            type="email"
            fullWidth
            className={Styles.textBox}
            label="Your health practitioner's email address (optional)"
            value={details.doctorEmail}
            inputProps={{ maxLength: 100 }}
            error={!!details.errors.doctorEmail}
            onChange={this.onChange.bind(this, "doctorEmail")}
          />
        </div>

        <div className={Styles["field-wrapper"]}>
          <input type="submit" className={Styles["next-button"]} value="Next" />
        </div>
      </form>
    );
  }
}

export default withRouter(Doctor);
