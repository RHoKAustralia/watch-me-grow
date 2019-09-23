import React from "react";
import Link from "next/link";
import classNames from "classnames";

import Styles from "./switcher.module.scss";

type Props = {
  text: string;
  leftHref?: [string, string?];
  rightHref?: [string, string?];
  onLeftClick?: () => void;
  onRightClick?: () => void;
  leftDisabled: boolean;
  rightDisabled: boolean;
};

class Switcher extends React.Component<Props> {
  render() {
    const leftClassName = classNames(Styles["button--left"], {
      [Styles["button--disabled"]]: this.props.leftDisabled
    });

    const rightClassName = classNames(Styles["button--right"], {
      [Styles["button--disabled"]]: this.props.rightDisabled
    });

    return (
      <div className={Styles["question-switcher"]}>
        {this.props.leftHref ? (
          <Link href={this.props.leftHref[0]} as={this.props.leftHref[1]}>
            <a className={leftClassName}>
              <i className="material-icons">chevron_left</i>
            </a>
          </Link>
        ) : (
          <button onClick={this.props.onLeftClick} className={leftClassName}>
            <i className="material-icons">chevron_left</i>
          </button>
        )}
        <span className={Styles.title}>{this.props.text}</span>
        {this.props.rightHref ? (
          <Link href={this.props.rightHref[0]} as={this.props.rightHref[1]}>
            <a className={rightClassName}>
              <i className="material-icons">chevron_right</i>
            </a>
          </Link>
        ) : (
          <button onClick={this.props.onRightClick} className={rightClassName}>
            <i className="material-icons">chevron_right</i>
          </button>
        )}
      </div>
    );
  }
}

export default Switcher;
