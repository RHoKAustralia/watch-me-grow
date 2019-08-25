import React from "react";
import classNames from "classnames";
import { Translation } from "react-i18next";

import Styles from "./footer.module.scss";

type Props = {
  concern: boolean;
};

class Header extends React.Component<Props> {
  render() {
    return (
      <Translation ns={["default"]}>
        {t => (
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
      </Translation>
    );
  }
}

export default Header;
