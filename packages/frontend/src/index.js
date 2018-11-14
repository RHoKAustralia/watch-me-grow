import React from "react";
import ReactDOM from "react-dom";
import { Router, useRouterHistory, Route, IndexRoute } from "react-router";
import { createHistory } from "history";
import Routes from "./components/routes";
// Base styling
import "./components/base.scss";

// ID of the DOM element to mount app on
const DOM_APP_EL_ID = "root";

const browserHistory = useRouterHistory(createHistory)({
  basename: process.env.ROOT_ROUTE
});

browserHistory.listen(location => {
  window.ga("send", "screenview", {
    screenName: location.pathname
  });
});

// Render the router
ReactDOM.render(
  <Router history={browserHistory}>{Routes}</Router>,
  document.getElementById(DOM_APP_EL_ID)
);
