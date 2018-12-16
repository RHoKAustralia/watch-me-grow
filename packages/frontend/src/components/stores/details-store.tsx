import React, { Component } from "react";
import emailValidator from "email-validator";
import moment from "moment";

type State = {
  babyFirstName: string;
  babyLastName: string;
  babyGender: string;
  babyDob?: moment.Moment;
  parentName: string;
  parentEmail: string;
  doctorEmail: string;
  errors: Errors;
  validated?: boolean;
};

type RequiredValue =
  | "babyFirstName"
  | "babyLastName"
  | "babyGender"
  | "parentName"
  | "parentEmail";

type OptionalValue = "babyDob" | "validated" | "doctorEmail";

export type PossibleValue = RequiredValue | OptionalValue;

type Errors = { [name: string]: string };

export type Details = State & {
  setState: (newDetails: { [name: string]: any }) => void;
  save: () => void;
  validate: () => boolean;
  clear: () => void;
  ageInMonths: () => number;
};

export type WrappedComponentProps = {
  details: Details;
};

const REQUIRED_TEXT: Array<RequiredValue> = [
  "babyFirstName",
  "babyLastName",
  "babyGender",
  "parentName",
  "parentEmail"
];
const LOCAL_STORAGE_KEY = "wmg-details";

const DetailsStore = (
  ComposedComponent: React.ComponentClass<WrappedComponentProps, any>
) =>
  class extends Component<{}, State> {
    static displayName = "DetailsStore";

    state = this.buildInitialState();

    buildInitialState(): State {
      return {
        babyFirstName: "",
        babyLastName: "",
        babyGender: "",
        parentName: "",
        parentEmail: "",
        doctorEmail: "",
        errors: {} as Errors
      };
    }

    UNSAFE_componentWillMount() {
      const fromStorageRaw = sessionStorage.getItem(LOCAL_STORAGE_KEY);
      if (fromStorageRaw) {
        const storedDetails = JSON.parse(fromStorageRaw);

        this.setState({
          babyFirstName: storedDetails.babyFirstName,
          babyLastName: storedDetails.babyLastName,
          babyGender: storedDetails.babyGender,
          babyDob: moment(storedDetails.babyDob),
          parentName: storedDetails.parentName,
          parentEmail: storedDetails.parentEmail,
          doctorEmail: storedDetails.doctorEmail
        });
      }
    }

    validate = () => {
      const errors = {} as Errors;

      REQUIRED_TEXT.forEach(name => {
        if (!this.state[name] || !this.state[name].length) {
          errors[name] = "Required";
        }
      });

      if (
        !errors.parentEmail &&
        !emailValidator.validate(this.state.parentEmail)
      ) {
        errors.parentEmail =
          "This doesn't look like an email address - try checking it again?";
      }

      if (!this.state.babyDob) {
        errors.babyDob = "Required";
      } else if (this.state.babyDob.isAfter(moment().subtract(6, "months"))) {
        errors.babyDob =
          "WatchMeGrow.care is intended for babies older than 6 months";
      }

      const validated = !Object.keys(errors).length;

      this.setState({
        errors,
        validated
      });

      return validated;
    };

    save = () => {
      sessionStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          babyFirstName: this.state.babyFirstName,
          babyLastName: this.state.babyLastName,
          babyGender: this.state.babyGender,
          babyDob: this.state.babyDob ? this.state.babyDob.toString() : null,
          parentName: this.state.parentName,
          parentEmail: this.state.parentEmail
        })
      );
    };

    onDetailsChanged = (newDetails: { [name: string]: any }) => {
      this.setState(Object.assign({ validated: false }, newDetails) as State);
    };

    clear = () => {
      sessionStorage.removeItem(LOCAL_STORAGE_KEY);
      this.setState(this.buildInitialState());
    };

    ageInMonths = () => {
      return moment().diff(this.state.babyDob, "months");
    };

    render() {
      const details = Object.assign({}, this.state, {
        setState: this.onDetailsChanged,
        save: this.save,
        validate: this.validate,
        clear: this.clear,
        ageInMonths: this.ageInMonths
      });

      return <ComposedComponent {...this.props} details={details} />;
    }
  };

export default DetailsStore;
