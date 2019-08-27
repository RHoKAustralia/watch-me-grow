import React from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import i18next from "i18next";

import Styles from "./header.module.scss";
import Link from "src/frontend/components/common/active-class-link";

const languages = [
  { value: "en", label: "English" },
  { value: "id", label: "Bahasa Indonesia" }
];

class Header extends React.Component {
  state = {
    language: i18next.language || "en"
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
        <Link href="landing">
          <img className={Styles.logo} src={"/static/wmg-header-logo.svg"} />
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
        <Link href="landing" activeClassName={Styles.active}>
          <a className={Styles["new-child"]}>New Child</a>
        </Link>
      </header>
    );
  }
}

export default Header;
