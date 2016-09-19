import React from 'react';
import {Route, IndexRedirect} from 'react-router';

import App from './app';
import LandingPage from './pages/landing/landing';
import QuestionnairePage from './pages/questionnaire/questionnaire';
import Question from './pages/questionnaire/question/question';
import Details from './pages/questionnaire/details/details';
import Result from './pages/result/result';

export default (
    <Route path="/" component={App}>
        <IndexRedirect to="landing" />
        <Route path="landing" component={LandingPage} />
        <Route path="questionnaire" component={QuestionnairePage}>
            <IndexRedirect to="details"/>
            <Route path="details" component={Details}/>
            <Route path="questions/:questionNumber" component={Question}/>
        </Route>
        <Route path="result" component={Result}/>
    </Route>
);
