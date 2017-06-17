import React from "react";
import Styles from "./landing.scss";
import {Link} from 'react-router';

export default class HomePage extends React.Component {
  componentWillMount() {
    this.props.results.clear();
    this.props.details.clear();
  }

  render() {
    return (
      <div className={Styles.content}>
        <h1 className={Styles.heading}>All children grow and develop at their own pace.</h1>
        <p className={Styles.paragraph}>Watch Me Grow helps track your child's progress and provides information about healthy.</p>
        <p className={Styles.paragraph}>
          This app is designed for children aged approximately 12 to 24 months
        </p>
        <Link className={Styles.button} to="questionnaire">Start Questionnaire</Link>
      </div>
    );
  }
}
