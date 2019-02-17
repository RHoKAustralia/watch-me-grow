import React from "react";
import { Link } from "react-router";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import i18next from "i18next";

import headerLogo from "./wmg-header-logo.svg";

import Styles from "./header.module.scss";

const languages = [
  { value: "en", label: "English" },
  { value: "id", label: "Bahasa Indonesia" }
];

class Header extends React.Component {
  state = {
    language: i18next.language
  };

  constructor(props: any) {
    super(props);

    i18next.on("languageChanged", this.updateLanguageFromi18n);
  }

  componentWillUnmount() {
    i18next.off("languageChanged", this.updateLanguageFromi18n);
  }

  updateLanguageFromi18n = (language: string) => {
    this.setState({
      language
    });
  };

  handleChange = (event: any) => {
    i18next.changeLanguage(event.target.value);
  };

  render() {
    return (
      <header className={Styles.header}>
        <Link to="landing">
          <img className={Styles.logo} src={headerLogo} />
        </Link>
        <h1 className={Styles.title}>WatchMeGrow.care</h1>
        <Select
          value={this.state.language}
          onChange={this.handleChange}
          className={Styles["language-dropdown"]}
        >
          {languages.map(language => (
            <MenuItem value={language.value}>{language.label}</MenuItem>
          ))}
        </Select>
        <Link
          className={Styles["new-child"]}
          to="landing"
          activeClassName={Styles.active}
        >
          New Child
        </Link>
      </header>
    );
  }
}

export default Header;
