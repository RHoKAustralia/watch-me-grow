import React from "react";
import Styles from "./landing.scss";
import { Link } from "react-router";

export default class HomePage extends React.Component {
  componentWillMount() {
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
          Watch Me Grow helps track your child's progress and provides
          information about healthy development.
        </p>
        <p className={Styles.paragraph}>
          This app is designed for children aged approximately 12 to 24 months
        </p>
        <p className={Styles.paragraph}>
          For general information on growth and development for children from
          birth to 5 years please see the
          following link:{" "}
          <a
            className={Styles.link}
            target="_blank"
            href="https://www.cdc.gov/ncbddd/actearly/index.html"
          >
            Learn the Signs - Act Early
          </a>.
        </p>
        <Link className={Styles.button} to="questionnaire">
          Start Questionnaire
        </Link>
      </div>
    );
  }
}
