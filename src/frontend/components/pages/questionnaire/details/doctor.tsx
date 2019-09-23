import React, { FormEvent } from "react";
import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";
import { Translation } from "react-i18next";
import TextField from "@material-ui/core/TextField";

import {
  Details as DetailsStoreState,
  PossibleValue as PossibleDetailsValue
} from "src/frontend/components/stores/details-store";
import QuestionWrapper from "../question-wrapper";
import { Results as ResultsStoreState } from "src/frontend/components/stores/results-store";

import Styles from "./details.module.scss";

type Props = {
  details: DetailsStoreState;
  results: ResultsStoreState;
} & WithRouterProps;

class Doctor extends React.Component<Props, {}> {
  state = {};

  onSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (this.props.details.validate()) {
      this.props.details.save();
      this.props.router.push(
        "/questionnaire/questions/[questionNumber]",
        "/questionnaire/questions/1"
      );
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
      <QuestionWrapper
        details={this.props.details}
        results={this.props.results}
      >
        {(questions, questionNumber) => (
          <Translation ns={["default"]}>
            {t => (
              <form className={Styles.details} onSubmit={this.onSubmit}>
                <div className={Styles.intro}>
                  <p className={Styles.paragraph}>
                    {t("doctorDetails.explanationPara1")}
                  </p>

                  <p className={Styles.paragraph}>
                    {t("doctorDetails.explanationPara2")}
                  </p>
                </div>

                <div className={Styles["field-wrapper"]}>
                  <TextField
                    type="email"
                    fullWidth
                    className={Styles.textBox}
                    label={t("doctorDetails.yourDoctorsEmailAddress")}
                    value={details.doctorEmail}
                    inputProps={{ maxLength: 100 }}
                    error={!!details.errors.doctorEmail}
                    onChange={this.onChange.bind(this, "doctorEmail")}
                  />
                </div>

                <div className={Styles["field-wrapper"]}>
                  <input
                    type="submit"
                    className={Styles["next-button"]}
                    value={t("app.next").toString()}
                  />
                </div>
              </form>
            )}
          </Translation>
        )}
      </QuestionWrapper>
    );
  }
}

export default withRouter(Doctor);
