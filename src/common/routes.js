import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './app';
import LandingPage from '../pages/landing/landing';
import QuestionnairePage from '../pages/questionnaire/questionnaire';
import Question from '../pages/questionnaire/question/question';
import Details from '../pages/questionnaire/details/details';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={LandingPage}/>
    <Route path="landing" component={LandingPage}/>
    <Route path="questionnaire" component={QuestionnairePage}>
      <IndexRoute component={Details}/>
      <Route path="details" component={Details}/>
      <Route path="questions/:questionNumber" component={Question}/>
    </Route>
  </Route>
);
