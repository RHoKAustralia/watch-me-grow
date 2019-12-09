import React from "react";

import { sites } from "src/common/site-specific-config";

export default class Downloads extends React.Component {
  async componentDidMount() {}

  render() {
    return (
      <div>
        <h5>Download CSV Files</h5>
        <ul>
          {sites.map(site => (
            <li>
              <a href={"/api/downloadCsv?siteId=" + site.id}>
                {site.id} ({site.host})
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
