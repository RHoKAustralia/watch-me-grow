import React from "react";
import AsyncComponent from "../../common/async-component";

const blah = () => import("./inner").then(module => module.default);

export default class AdminPage extends React.Component {
  render() {
    return (
      <AsyncComponent importComponent={blah}>
        {Inner => {
          if (Inner) {
            return <Inner />;
          } else {
            return "Loading...";
          }
        }}
      </AsyncComponent>
    );
  }
}
