import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './app';
import LandingPage from '../pages/landing/landing';
import QuestionnairePage from '../pages/questionnaire/questionnaire';


export default (
  <Route path="/" component={App}>
    <IndexRoute component={LandingPage} />
    <Route path="landing" component={LandingPage} />
    <Route path="questionnaire" component={QuestionnairePage} />
  </Route>
);
