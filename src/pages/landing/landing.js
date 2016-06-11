import React from "react";
import Styles from "./landing.less";
import {Link} from 'react-router';


export default class HomePage extends React.Component {
  render() {
    return (
      <div className={Styles.content}>
        <h1 className={Styles.heading}>All children grow and develop at their own pace.</h1>
        <p className={Styles.paragraph}>Watch Me Grow helps track your child's progress & recommend opportunities to enhance early development</p>
        <p className={Styles.paragraph}>
          This programme is designed for children aged 6 months to 4 years and is supported by the University of New
          South Wales.
        </p>
        <Link className={Styles.button} to="questionnaire">Start Questionnaire</Link>
      </div>
    );
  }
}
