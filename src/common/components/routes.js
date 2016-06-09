import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './app';
// import LoginPage from '../../pages/login/page';
import LandingPage from '../../pages/landing/landing';


export default (
  <Route path="/" component={App}>
    <IndexRoute component={LandingPage} />
    <Route path="landing" component={LandingPage} />
  </Route>
);
