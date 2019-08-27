import React from "react";
import { Link } from "react-router";
import classNames from "classnames";

import Styles from "./switcher.module.scss";

type Props = {
  text: string;
  leftHref?: string;
  rightHref?: string;
  onLeftClick?: () => void;
  onRightClick?: () => void;
  leftDisabled: boolean;
  rightDisabled: boolean;
};

class Switcher extends React.Component<Props> {
  render() {
    const LeftElement = this.props.leftHref ? (
      <Link to={this.props.leftHref} />
    ) : (
      <button />
    );
    const RightElement = this.props.rightHref ? (
      <Link to={this.props.rightHref} />
    ) : (
      <button />
    );

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
