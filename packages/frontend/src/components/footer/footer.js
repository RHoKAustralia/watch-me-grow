import PropTypes from "prop-types";
import React from "react";
import classNames from "classnames";
import { NamespacesConsumer } from "react-i18next";

import Styles from "./footer.module.scss";

class Header extends React.Component {
  static propTypes = {
    concern: PropTypes.bool
  };

  render() {
    return (
      <NamespacesConsumer ns={["default"]}>
        {(t, { i18n, ready }) => (
          <footer
            className={classNames(Styles.footer, {
              [Styles.concern]: this.props.concern
            })}
          >
            <div className={Styles.inner}>
              <p className={Styles.blurb}>{t("app.footer")}</p>
            </div>
          </footer>
        )}
      </NamespacesConsumer>
    );
  }
}

export default Header;
