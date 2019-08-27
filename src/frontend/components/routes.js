// import React from "react";
// import { Route, IndexRedirect } from "react-router";

// import App from "./app";
// import LandingPage from "./pages/landing/landing";
// import QuestionnairePage from "./pages/questionnaire/questionnaire";
// import QuestionComponent from "./pages/questionnaire/question/question";
// import Consent from "./pages/questionnaire/details/consent";
// import Details from "./pages/questionnaire/details/details";
// import Doctor from "./pages/questionnaire/details/doctor";
// import Result from "./pages/result/result";
// import Admin from "./pages/admin/admin";

// export default (
//   <Route path="/" component={App}>
//     <IndexRedirect to="landing" />
//     <Route path="landing" component={LandingPage} />
//     <Route path="questionnaire" component={QuestionnairePage}>
//       <IndexRedirect to="consent" />
//       <Route path="consent" component={Consent} />
//       <Route path="details" component={Details} />
//       <Route path="doctor" component={Doctor} />
//       <Route path="questions/:questionNumber" component={QuestionComponent} />
//     </Route>
//     <Route path="result" component={Result} />
//     <Route path="admin" component={Admin} />
//   </Route>
// );
