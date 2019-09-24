import React from "react";
import classNames from "classnames";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Translation } from "react-i18next";
import { default as NextApp } from "next/app";
import { NextComponentType } from "next-server/dist/lib/utils";
import Head from "next/head";
// @ts-ignore
import withGA from "next-ga";
import Router from "next/router";

import Header from "./header/header";
import Footer from "./footer/footer";
import Styles from "./app.module.scss";
import withDetailsStore, {
  Details as DetailsStoreState
} from "src/frontend/components/stores/details-store";
import withResultsStore, {
  Results as ResultsStoreState
} from "src/frontend/components/stores/results-store";
import { ConsentStore } from "src/frontend/components/stores/consent-store";
import { getConfigByHost } from "src/common/site-specific-config";
import "src/frontend/i18n";
import theme from "src/frontend/theme";

// Base styling
import "./base.scss";

type Props = {
  details: DetailsStoreState;
  results: ResultsStoreState;
  Component: NextComponentType;
  analytics: any;
};

type State = {
  client: boolean;
};

class App extends NextApp<Props, State> {
  state = {
    client: false
  };

  content(Component: any, pageProps: any) {
    return getConfigByHost(window.location.hostname) ? (
      <div className={Styles.container}>
        <Component
          {...pageProps}
          analytics={this.props.analytics}
          details={this.props.details}
          results={this.props.results}
        />
      </div>
    ) : (
      <Translation ns={["default"]}>
        {t => (
          <div>
            {t("app.noConfigMessage", {
              hostname: window.location.hostname
            })}
          </div>
        )}
      </Translation>
    );
  }

  componentDidMount() {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentNode!.removeChild(jssStyles);
    }

    this.setState({
      client: true
    });
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <ConsentStore>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <div
            className={classNames(Styles.app, {
              [Styles.concern]: this.props.results.anyConcerns()
            })}
          >
            <Head>
              <link
                href="https://fonts.googleapis.com/icon?family=Material+Icons"
                rel="stylesheet"
              />
            </Head>
            <Header />

            {this.state.client && this.content(Component, pageProps)}

            <div className={Styles.spacer} />
            <Footer concern={this.props.results.anyConcerns()} />
          </div>
        </MuiThemeProvider>
      </ConsentStore>
    );
  }
}

export default withGA("ABC", Router)(withResultsStore(withDetailsStore(App)));
