import React from "react";
import classNames from "classnames";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Translation } from "react-i18next";
import { default as NextApp } from "next/app";
import { AppContextType, NextComponentType } from "next-server/dist/lib/utils";
import { Router } from "next/dist/client/router";

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
import i18n from "src/i18n";

const { appWithTranslation } = i18n;

type Props = {
  details: DetailsStoreState;
  results: ResultsStoreState;
  Component: NextComponentType;
  host: string;
};

const theme = createMuiTheme({
  typography: {
    // htmlFontSize: 10,
    fontSize: 18
  },
  overrides: {
    MuiInputLabel: {
      root: {
        color: "rgba(0, 0, 0, 0.26)"
      }
    }
  },
  palette: {
    primary: { main: "#1cd5ac", dark: "#1cd5ac" }
  }
});

class App extends NextApp<Props> {
  static async getInitialProps(appContext: AppContextType<Router>) {
    // calls page's `getInitialProps` and fills `appProps.pageProps`
    const appProps = await App.getInitialProps(appContext);

    return { ...appProps, host: appContext.ctx.req.headers.host };
  }
  render() {
    const { Component, pageProps } = this.props;

    return (
      <ConsentStore>
        <MuiThemeProvider theme={theme}>
          <div
            className={classNames(Styles.app, {
              [Styles.concern]: this.props.results.anyConcerns()
            })}
          >
            <Header />
            {getConfigByHost(this.props.host) ? (
              <div className={Styles.container}>
                <Component
                  {...pageProps}
                  details={this.props.details}
                  results={this.props.results}
                />
              </div>
            ) : (
              <Translation ns={["default"]}>
                {t => (
                  <div>
                    {this.props.t("app.noConfigMessage", {
                      hostname: window.location.hostname
                    })}
                  </div>
                )}
              </Translation>
            )}
            <div className={Styles.spacer} />
            <Footer concern={this.props.results.anyConcerns()} />
          </div>
        </MuiThemeProvider>
      </ConsentStore>
    );
  }
}

export default appWithTranslation(withResultsStore(withDetailsStore(App)));
