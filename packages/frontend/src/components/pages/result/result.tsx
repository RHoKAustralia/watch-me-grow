import React from "react";
import classNames from "classnames";
import { withRouter, WithRouterProps } from "react-router";
import moment from "moment";

import { ReactComponent as Flag } from "./flag.svg";
import { ReactComponent as Stethoscope } from "./stethoscope.svg";
import StageSwitcher from "./stage-switcher";
import stages from "./stages/stages";
import strings from "@wmg/common/lib/strings";
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
    const months = moment().diff(this.props.details.babyDob, "months");

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
                  {strings.result.concerns.title}
                </h5>
              );
            } else {
              return (
                <React.Fragment>
                  <h5 className={Styles["outcome--title"]}>
                    {strings.result.noConcerns.title}
                  </h5>
                  <h6 className={Styles["outcome--subtitle"]}>
                    {strings.result.noConcerns.subtitle}
                  </h6>
                </React.Fragment>
              );
            }
          })()}
        </div>
        <div className={Styles.disclaimer}>
          All children grow and develop at their own pace. Please see below for
          information on what is expected for your child's age.
        </div>
        <StageSwitcher stages={stages} initialStage={this.getInitialStage()} />
      </article>
    );
  }
}

export default withRouter(Result);
