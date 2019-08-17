import React, { FormEvent } from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import { withRouter, WithRouterProps } from "react-router";
import * as _ from "lodash";
import Input from "@material-ui/core/Input";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { NamespacesConsumer } from "react-i18next";
import i18next from "i18next";

import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker";
import Styles from "./details.module.scss";
import TextField from "@material-ui/core/TextField";
import minMax from "@wmg/common/lib/min-max";
import questionnaires from "../../../../data/questionnaires";
import {
  Details as DetailsStoreState,
  PossibleValue as PossibleDetailsValue
} from "../../../stores/details-store";
import { Results as ResultsStoreState } from "../../../stores/results-store";

const GENDERS = [
  { id: "male", captionId: "details.genders.male" },
  { id: "female", captionId: "details.genders.female" },
  { id: "other", captionId: "details.genders.other" }
];

const { minMonths, maxMonths } = questionnaires
  ? minMax(questionnaires)
  : { minMonths: 0, maxMonths: 0 };
const minDate = moment().subtract(maxMonths, "months");
const maxDate = moment().subtract(minMonths, "months");

type Props = {
  details: DetailsStoreState;
  results: ResultsStoreState;
} & WithRouterProps;

type State = {
  showDatePicker: boolean;
  locale: string;
};

class Details extends React.Component<Props, State> {
  state: State = { showDatePicker: false, locale: "en" };

  constructor(props: Props) {
    super(props);
    const language = i18next.language;

    if (language) {
      this.setLocale(language);
    }

    i18next.on("languageChanged", this.setLocale);
  }

  componentWillUnmount() {
    i18next.off("languageChanged", this.setLocale);
  }

  setLocale = (locale: string) => {
    const localePackagePromise = (() => {
      if (locale === "id") {
        return import(`date-fns/locale/id/index.js`);
      } else {
        return import(`date-fns/locale/en-GB/index.js`);
      }
    })();

    localePackagePromise
      .then(localeObj => {
        registerLocale(locale, localeObj);
        this.setState({
          locale
        });
      })
      .catch(err => {
        console.error("Error while trying to load locale " + locale, err);
      });
  };

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
    console.log(event.target.value);
    this.onChangeValue(propertyName, event.target.value);
  };

  onDateClick = () => {
    this.setState({
      showDatePicker: true
    });
  };

  onDateChange = (value: Date) => {
    this.closeDatePicker();
    this.props.results.clear();
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
      <NamespacesConsumer ns={["default"]}>
        {(t, { i18n, ready }) => (
          <form className={Styles.details} onSubmit={this.onSubmit}>
            <div className={Styles["field-wrapper"]}>
              <TextField
                type="text"
                className={Styles["text-box"]}
                label={t("details.childFirstName")}
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
                label={t("details.childLastName")}
                value={details.babyLastName}
                error={!!details.errors.babyLastName}
                inputProps={{ maxLength: 100 }}
                fullWidth
                onFocus={this.closeDatePicker}
                onChange={this.onChange.bind(this, "babyLastName")}
              />
            </div>
            <div className={Styles["field-wrapper"]}>
              <FormControl fullWidth>
                <InputLabel
                  htmlFor="gender"
                  error={!!details.errors.babyGender}
                >
                  Your child's gender
                </InputLabel>
                <Select
                  value={details.babyGender}
                  error={!!details.errors.babyGender}
                  fullWidth
                  onFocus={this.closeDatePicker}
                  onChange={this.onChange.bind(this, "babyGender")}
                  placeholder="Blah"
                  input={<Input name="gender" id="gender" />}
                >
                  {GENDERS.map(({ id, captionId }) => (
                    <MenuItem value={id}>{t(captionId)}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className={Styles["field-wrapper"]}>
              <TextField
                inputProps={{ readOnly: true }}
                onFocus={this.onDateClick}
                label={t("details.childDob")}
                type="text"
                className={Styles["text-box"]}
                fullWidth
                value={
                  details.babyDob
                    ? moment(details.babyDob).format("DD/MM/YYYY")
                    : ""
                }
                error={!!details.errors.babyDob}
              />
            </div>
            <div className={Styles["field-wrapper"]}>
              {this.state.showDatePicker && (
                <DatePicker
                  inline
                  showYearDropdown
                  minDate={minDate.toDate()}
                  maxDate={maxDate.toDate()}
                  selected={details!.babyDob}
                  onChange={this.onDateChange}
                  locale={this.state.locale}
                />
              )}
            </div>
            <div className={Styles["field-wrapper"]}>
              <TextField
                type="text"
                className={Styles["text-box"]}
                label={t("details.yourName")}
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
                label={t("details.yourEmailAddress")}
                value={details.parentEmail}
                inputProps={{ maxLength: 100 }}
                InputLabelProps={{ className: Styles["email-box-label"] }}
                fullWidth
                error={!!details.errors.parentEmail}
                onFocus={this.closeDatePicker}
                onChange={this.onChange.bind(this, "parentEmail")}
              />
            </div>
            <div>
              <input
                type="submit"
                className={Styles["next-button"]}
                value={t("app.next").toString()}
              />
            </div>
          </form>
        )}
      </NamespacesConsumer>
    );
  }
}

export default withRouter(Details);
