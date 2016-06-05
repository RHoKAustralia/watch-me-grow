'use strict';

import angular from 'angular';
import _ from 'lodash';

/**
 * Adds and retrieves answers
 */
class AnswersService {
    constructor($q, $localStorage, questionnaireService) {
        this.$q = $q;
        this.$localStorage = $localStorage;
        this.questionnaireService = questionnaireService;
    }

    addAnswer(questionnaireId, questionId, answerId, comment) {
        return this.$q((resolve, reject) => {
            getQuestionnaireAnswers(questionnaireId)[questionId] = {
                answerId: answerId,
                comment: comment
            };
            resolve();
        });
    }

    getCurrentQuestionnaire() {
        return this.$q(resolve =>
            resolve(_.find(this.questionnaireService.getQuestionnaires(), questionnaire =>
                questionnaire.questions > Object.keys(this.questionnaireAnswers(questionnaire.id)).length
            ))
        );
    }

    getCurrentQuestion() {
        return this.getCurrentQuestionnaire()
            .then(currentQuestionnaire => {
                if (currentQuestionnaire) {
                    return currentQuestionnaire.questions.find(question =>
                        !this._getQuestionnaireAnswers(currentQuestionnaire.id)[question.id]
                    );
                }
            });
    }

    clear() {
        this.$localStorage.answers = undefined;
    }

    _getAllAnswers() {
        this.$localStorage.answers = this.$localStorage.answers || {};
        return this.$localStorage.answers;
    }

    _getQuestionnaireAnswers(questionnaireId) {
        const allAnswers = this._getAllAnswers();
        allAnswers[questionnaireId] = allAnswers[questionnaireId] || {};
        return allAnswers[questionnaireId];
    }
}

AnswersService.$inject = ['$q', '$localStorage'];

export default angular.module('services.answers', ['ngStorage'])
    .service('AnswerService', AnswersService)
    .name;