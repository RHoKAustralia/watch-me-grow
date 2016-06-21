/**
 * App entry point
 */

import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import Routes from './common/routes';// Base styling
import './common/base.less';
import injectTapEventPlugin from 'react-tap-event-plugin';

// ID of the DOM element to mount app on
const DOM_APP_EL_ID = 'app';

injectTapEventPlugin();

// Render the router
ReactDOM.render((
  <Router history={browserHistory}>
    {Routes}
  </Router>
), document.getElementById(DOM_APP_EL_ID));

