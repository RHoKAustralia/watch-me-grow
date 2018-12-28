import React from "react";
import { Link } from "react-router";
import headerLogo from "./wmg-header-logo.svg";

import Styles from "./header.module.scss";

class Header extends React.Component {
  render() {
    return (
      <header className={Styles.header}>
        <Link to="landing">
          <img className={Styles.logo} src={headerLogo} />
        </Link>
        <h1 className={Styles.title}>WatchMeGrow.care</h1>
        <Link
          className={Styles["new-child"]}
          to="landing"
          activeClassName={Styles.active}
        >
          New Child
        </Link>
      </header>
    );
  }
}

export default Header;
