import React from "react";
import firebase from "firebase";

import { siteSpecificConfig } from "@wmg/common/lib/site-specific-config";

export default class Downloads extends React.Component {
  async componentDidMount() {}

  render() {
    return (
      <div>
        {Object.keys(siteSpecificConfig).map(site => (
          <React.Fragment>
            <h2>{site}</h2>
            <a href={"/api/downloadCsv?siteId=" + site}>Download CSV</a>
          </React.Fragment>
        ))}
      </div>
    );
  }
}
