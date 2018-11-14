import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router";
import classNames from "classnames";

import Styles from "./switcher.module.scss";

class Switcher extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    leftHref: PropTypes.string,
    rightHref: PropTypes.string,
    onLeftClicked: PropTypes.func,
    onRightClicked: PropTypes.func,
    leftDisabled: PropTypes.bool,
    rightDisabled: PropTypes.bool
  };

  render() {
    const LeftElement = this.props.leftHref ? <Link /> : <button />;
    const RightElement = this.props.rightHref ? <Link /> : <button />;

    return (
      <div className={Styles["question-switcher"]}>
        {React.cloneElement(LeftElement, {
          onClick: this.props.onLeftClick,
          to: this.props.leftHref,
          className: classNames(Styles["button--left"], {
            [Styles["button--disabled"]]: this.props.leftDisabled
          }),
          children: <i className="material-icons">chevron_left</i>
        })}
        <span className={Styles.title}>{this.props.text}</span>
        {React.cloneElement(RightElement, {
          onClick: this.props.onRightClick,
          to: this.props.rightHref,
          className: classNames(Styles["button--right"], {
            [Styles["button--disabled"]]: this.props.rightDisabled
          }),
          children: <i className="material-icons">chevron_right</i>
        })}
      </div>
    );
  }
}

export default Switcher;
