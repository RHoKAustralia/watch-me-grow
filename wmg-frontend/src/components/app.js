import PropTypes from "prop-types";
import React from "react";
import classNames from "classnames";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import Header from "./header/header";
import Footer from "./footer/footer";
import Styles from "./app.module.scss";
import withDetailsStore from "./stores/details-store";
import withResultsStore from "./stores/results-store";

const theme = createMuiTheme({
  typography: {
    // htmlFontSize: 10,
    fontSize: 18
  },
  palette: {
    primary: { main: "#1CD5AC" },
    grey: { 300: "#EEE" }
  }
});

class App extends React.Component {
  static propTypes = {
    details: PropTypes.object,
    results: PropTypes.object
  };

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div
          className={classNames(Styles.app, {
            [Styles.concern]: this.props.results.concern
          })}
        >
          <Header />
          <div className={Styles.container}>
            {this.props.children &&
              React.cloneElement(this.props.children, {
                results: this.props.results,
                details: this.props.details
              })}
          </div>
          <div className={Styles.spacer} />
          <Footer concern={this.props.results.concern} />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withResultsStore(withDetailsStore(App));
