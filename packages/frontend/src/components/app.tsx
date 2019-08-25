import React from "react";
import classNames from "classnames";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Translation } from "react-i18next";

import Header from "./header/header";
import Footer from "./footer/footer";
import Styles from "./app.module.scss";
import withDetailsStore, {
  Details as DetailsStoreState
} from "./stores/details-store";
import withResultsStore, {
  Results as ResultsStoreState
} from "./stores/results-store";
import { ConsentStore } from "./stores/consent-store";
import config from "../util/subsite";
import { PossibleValue as PossibleDetailsValue } from "./stores/details-store";

type Props = {
  details: DetailsStoreState;
  results: ResultsStoreState;
  children: React.ReactElement<any>;
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

class App extends React.Component<Props> {
  render() {
    return (
      <ConsentStore>
        <MuiThemeProvider theme={theme}>
          <div
            className={classNames(Styles.app, {
              [Styles.concern]: this.props.results.anyConcerns()
            })}
          >
            <Header />
            {config ? (
              <div className={Styles.container}>
                {this.props.children &&
                  React.cloneElement(this.props.children, {
                    results: this.props.results,
                    details: this.props.details
                  })}
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
            )}
            <div className={Styles.spacer} />
            <Footer concern={this.props.results.anyConcerns()} />
          </div>
        </MuiThemeProvider>
      </ConsentStore>
    );
  }
}

export default withResultsStore(withDetailsStore(App));
