import React from "react";
import classNames from "classnames";
import { withRouter, WithRouterProps } from "react-router";

import { Translation } from "react-i18next";
import i18next from "i18next";

import { ReactComponent as Flag } from "./flag.svg";
import { ReactComponent as Stethoscope } from "./stethoscope.svg";
import { ConsentContext, ConsentState } from "../../stores/consent-store";
import stages from "./stages/stages";
import { Results } from "../../stores/results-store";
import { Details } from "../../stores/details-store";
import categoryToLink, { LinkData } from "@wmg/common/lib/category-to-link";

import sendResults from "../../../send-results";

import Styles from "./result.module.scss";

type Props = {
  results: Results;
  details: Details;
} & WithRouterProps;

class Result extends React.Component<Props, any> {
  static contextType = ConsentContext;

  componentDidMount() {
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

    const consent: ConsentState = this.context;

    sendResults(this.props.details, this.props.results, consent.consent);
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
    const concerns = this.props.results.concerns;
    const anyConcerns = this.props.results.anyConcerns();
    const iconClasses = classNames(
      Styles.icon,
      { [Styles["icon--concern"]]: anyConcerns },
      { [Styles["icon--no-concern"]]: !anyConcerns }
    );

    return (
      <Translation ns={["default"]}>
        {t => {
          if (concerns) {
            return (
              <article className={Styles.root}>
                {anyConcerns ? (
                  <Stethoscope className={iconClasses} />
                ) : (
                  <Flag className={iconClasses} />
                )}
                <div className={Styles.outcome}>
                  <h1 className={Styles["outcome--title"]}>
                    {anyConcerns
                      ? t("results.summaries.concern")
                      : t("results.summaries.noConcern")}
                  </h1>
                </div>
                {Object.keys(concerns).map(category => (
                  <SummaryPara
                    t={t}
                    tPrefix={`results.${category}`}
                    concern={concerns[category]}
                    links={categoryToLink[category]}
                  />
                ))}
              </article>
            );
          } else {
            return "Loading";
          }
        }}
      </Translation>
    );
  }
}

function SummaryPara({
  t,
  tPrefix,
  concern,
  links
}: {
  t: i18next.TFunction;
  tPrefix: string;
  concern: boolean;
  links: LinkData[];
}) {
  return (
    <React.Fragment>
      <h2 className={Styles.summaryHeading}>
        {t(`${tPrefix}.heading.parent`)}
      </h2>
      <p>{t(`${tPrefix}.${concern ? "concern" : "noConcern"}.parent`)}</p>
      {links.map(link => (
        <Link intro={t(link.introKey)} url={link.url} />
      ))}
    </React.Fragment>
  );
}

function Link({ intro, url }: { intro: string; url: string }) {
  return (
    <React.Fragment>
      <p className={Styles.disclaimer}>{intro}</p>
      <p className={Styles.raisingChildrenPara}>
        <a href={url} target="_blank" rel="noopenner noreferrer">
          {url}
        </a>
      </p>
    </React.Fragment>
  );
}

export default withRouter(Result);
