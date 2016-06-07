import React from "react";
import styles from "./landing.less";


export default class HomePage extends React.Component {
  render() {
    return (
      <div className={styles.content}>
        <h1>Watch Me Grow</h1>
        <p className={styles.welcomeText}>Thanks for joining!</p>
      </div>
    );
  }
}
