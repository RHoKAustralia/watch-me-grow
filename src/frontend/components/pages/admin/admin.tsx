import React from "react";
import { DocumentContext } from "next/document";

import Downloads from "./downloads";

import Styles from "./admin.module.scss";
import isAdmin from "src/api/is-admin";

export default class Admin extends React.Component {
  static async getInitialProps(ctx: DocumentContext) {
    if (ctx.req && ctx.res) {
      isAdmin(ctx.req, ctx.res);
    }
    return {};
  }

  render() {
    return (
      <div className={Styles.root}>
        <h1>Admin</h1>
        <Downloads />
      </div>
    );
  }
}
