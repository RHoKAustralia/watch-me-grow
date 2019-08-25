import React from "react";
import { Link } from "react-router";
import { Translation } from "react-i18next";

import { ConsentContext, ConsentState } from "../../stores/consent-store";
import ageInMonthsToString from "@wmg/common/lib/age-to-string";
import minMax from "@wmg/common/lib/min-max";
import questionnaires from "../../../data/questionnaires";
import { WrappedComponentProps as ResultsProps } from "../../stores/results-store";
import { WrappedComponentProps as DetailsProps } from "../../stores/details-store";

import Styles from "./landing.module.scss";

const { minMonths, maxMonths } = questionnaires
  ? minMax(questionnaires)
  : { minMonths: 0, maxMonths: 0 };

type Props = ResultsProps & DetailsProps;

export default class HomePage extends React.Component<Props, any> {
  static contextType = ConsentContext;

  componentDidMount() {
    this.props.results.clear();
    this.props.details.clear();
    (this.context as ConsentState).clear();
  }

  render() {
    return (
      <Translation ns={["default"]}>
        {t => (
          <div className={Styles.content}>
            <h1 className={Styles.heading}>{t("landing.heading")}</h1>
            <p className={Styles.paragraph}>{t("landing.explanation")}</p>
            <p className={Styles.paragraph}>
              {t("landing.ages", {
                minAge: ageInMonthsToString(minMonths, t),
                maxAge: ageInMonthsToString(maxMonths, t)
              })}
            </p>
            <p className={Styles.paragraph}>
              {t("landing.generalInformation.intro")}{" "}
              <a
                className={Styles.link}
                target="_blank"
                href="https://www.cdc.gov/ncbddd/actearly/index.html"
              >
                {t("landing.generalInformation.link")}
              </a>
              .
            </p>
            <Link className={Styles.button} to="questionnaire">
              {t("landing.startButton")}
            </Link>
          </div>
        )}
      </Translation>
    );
  }
}
