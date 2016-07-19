import moment from 'moment';

import strings from 'data/strings';
import questionnaires from 'data/questionnaires';
import {combineQuestionsAndAnswers} from 'data/data-functions';

const FORMAT = 'dddd, MMMM Do YYYY';

export default function sendResults(details, results) {
    const metadata = {
        subject: `Watch Me Grow Results for ${details.babyName}`,
        recipient_email: details.parentEmail,
        test_date: moment().format(FORMAT),
        name_of_parent: details.parentName,
        name_of_child: details.babyName,
        dob_child: details.babyDob.format(FORMAT),
        age_of_child: moment().diff(details.babyDob, 'years'),
        results_text: getResultText(results)
    };

    const data = Object.assign({}, metadata, generateQuestionnaireResults(results));

    if (true) {
        fetch('https://8ims93nxd2.execute-api.us-west-2.amazonaws.com/prod/send-email', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }
}

function getResultText(results) {
    const concernsStringObj = results.concern ? strings.result.concerns : strings.result.noConcerns;
    return concernsStringObj.title + " " + concernsStringObj.subtitle;
}

function generateQuestionnaireResults(results) {
    return questionnaires.reduce((acc, {id, questions}) => {
        acc[`${id}_answers`] = combineQuestionsAndAnswers(questions, results.getResultsForQuestionnaire(id))
            .reduce((acc, question) => {
                acc[question.metadata.id] = {answer: question.answer.metadata.text};
                return acc;
            }, {});
        return acc;
    }, {});
}
