import React from "react";
import Link from "next/link";
import { Translation } from "react-i18next";

import {
  ConsentContext,
  ConsentState
} from "src/frontend/components/stores/consent-store";
import ageInMonthsToString from "src/common/age-to-string";
import minMax from "src/common/min-max";
import questionnaires from "src/frontend/data/questionnaires";
import { WrappedComponentProps as ResultsProps } from "src/frontend/components/stores/results-store";
import { WrappedComponentProps as DetailsProps } from "src/frontend/components/stores/details-store";

import Styles from "./landing.module.scss";

type Props = ResultsProps & DetailsProps;

export default class HomePage extends React.Component<Props, any> {
  static contextType = ConsentContext;

  componentDidMount() {
    this.props.results.clear();
    this.props.details.clear();
    (this.context as ConsentState).clear();
  }

  render() {
    const { minMonths, maxMonths } = questionnaires()
      ? minMax(questionnaires())
      : { minMonths: 0, maxMonths: 0 };

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
            <Link href="/questionnaire">
              <a className={Styles.button}>{t("landing.startButton")}</a>
            </Link>
          </div>
        )}
      </Translation>
    );
  }
}
