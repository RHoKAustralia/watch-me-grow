import React from "react";
import firebase from "firebase";

import { sites } from "@wmg/common/lib/site-specific-config";

export default class Downloads extends React.Component {
  async componentDidMount() {}

  render() {
    return (
      <div>
        {sites.map(site => (
          <React.Fragment>
            <h2>
              {site.id} ({site.host}
            </h2>
            <a href={"/api/downloadCsv?siteId=" + site.id}>Download CSV</a>
          </React.Fragment>
        ))}
      </div>
    );
  }
}
