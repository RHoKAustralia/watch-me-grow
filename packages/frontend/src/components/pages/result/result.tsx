import React from "react";
import classNames from "classnames";
import { withRouter, WithRouterProps } from "react-router";
import moment from "moment";
import { NamespacesConsumer } from "react-i18next";

import { ReactComponent as Flag } from "./flag.svg";
import { ReactComponent as Stethoscope } from "./stethoscope.svg";
import StageSwitcher from "./stage-switcher";
import stages from "./stages/stages";
import { Results } from "../../stores/results-store";
import { Details } from "../../stores/details-store";

import sendResults from "../../../send-results";

import Styles from "./result.module.scss";

type Props = {
  results: Results;
  details: Details;
} & WithRouterProps;

class Result extends React.Component<Props, any> {
  UNSAFE_componentWillMount() {
    if (
      !this.props.details.validate() ||
      !this.props.results.isComplete(this.props.details.ageInMonths())
    ) {
      console.log(
        "Went to result without finishing, redirecting to questionnaire"
      );
      this.props.router.push("/questionnaire");
      return;
    }

    this.props.results.mark();

    (window as any).ga("send", {
      hitType: "event",
      eventCategory: "Completions",
      eventAction: this.props.results.concern ? "concern" : "no-concern"
    });

    sendResults(this.props.details, this.props.results);
  }

  getInitialStage = () => {
    const months = this.props.details.ageInMonths();

    return Math.max(
      0,
      stages.findIndex(
        stage => months >= stage.months.min && months <= stage.months.max
      )
    );
  };

  render() {
    const concern = this.props.results.concern;
    const iconClasses = classNames(
      Styles.icon,
      { [Styles["icon--concern"]]: concern },
      { [Styles["icon--no-concern"]]: !concern }
    );

    return (
      <NamespacesConsumer ns={["default"]}>
        {(t, { i18n, ready }) => (
          <article className={Styles.root}>
            {concern ? (
              <Stethoscope className={iconClasses} />
            ) : (
              <Flag className={iconClasses} />
            )}
            <div className={Styles.outcome}>
              {(() => {
                if (concern) {
                  return (
                    <h5 className={Styles["outcome--title"]}>
                      {t("results.redFlag")}
                    </h5>
                  );
                } else {
                  return (
                    <h5 className={Styles["outcome--title"]}>
                      {t("results.greenFlag")}
                    </h5>
                  );
                }
              })()}
            </div>
            <p className={Styles.disclaimer}>
              {t("results.raisingChildrenIntro")}
            </p>
            <p className={Styles.raisingChildrenPara}>
              <a
                href="https://raisingchildren.net.au"
                target="_blank"
                rel="noopenner noreferrer"
              >
                raisingchildren.net.au
              </a>
            </p>
          </article>
        )}
      </NamespacesConsumer>
    );
  }
}

export default withRouter(Result);
