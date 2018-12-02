import React from "react";
import { Link } from "react-router";

import questionnairesForSubsite from "@wmg/common/lib/questionnaires-for-subsite";
import minMax from "@wmg/common/lib/min-max";
import questionnaires from "../../../data/questionnaires";
import { WrappedComponentProps as ResultsProps } from "../../stores/results-store";
import { WrappedComponentProps as DetailsProps } from "../../stores/details-store";

import Styles from "./landing.module.scss";

const { minMonths, maxMonths } = minMax(questionnaires);

type Props = ResultsProps & DetailsProps;

export default class HomePage extends React.Component<Props, any> {
  UNSAFE_componentWillMount() {
    this.props.results.clear();
    this.props.details.clear();
  }

  render() {
    return (
      <div className={Styles.content}>
        <h1 className={Styles.heading}>
          All children grow and develop at their own pace.
        </h1>
        <p className={Styles.paragraph}>
          WatchMeGrow.care helps track your child's progress and provides
          information about healthy development.
        </p>
        <p className={Styles.paragraph}>
          This app is designed for children aged approximately {minMonths} to{" "}
          {maxMonths} months
        </p>
        <p className={Styles.paragraph}>
          For general information on growth and development for children from
          birth to 5 years please see the following link:{" "}
          <a
            className={Styles.link}
            target="_blank"
            href="https://www.cdc.gov/ncbddd/actearly/index.html"
          >
            Learn the Signs - Act Early
          </a>
          .
        </p>
        <Link className={Styles.button} to="questionnaire">
          Start Questionnaire
        </Link>
      </div>
    );
  }
}
