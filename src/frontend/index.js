// import React, { Suspense } from "react";
// import ReactDOM from "react-dom";
// import { Router, useRouterHistory, Route, IndexRoute } from "react-router";
// import { createHistory } from "history";
// import Routes from "./components/routes";

// import "./i18n";

// // Base styling
// import "./components/base.scss";

// // ID of the DOM element to mount app on
// const DOM_APP_EL_ID = "root";

// const browserHistory = useRouterHistory(createHistory)({
//   basename: process.env.ROOT_ROUTE
// });

// browserHistory.listen((location: any) => {
//   (window as any).ga("send", "screenview", {
//     screenName: location.pathname
//   });
// });

// // Render the router
// ReactDOM.render(
//   <Suspense fallback="Loading...">
//     <Router history={browserHistory}>{Routes}</Router>
//   </Suspense>,
//   document.getElementById(DOM_APP_EL_ID)
// );
