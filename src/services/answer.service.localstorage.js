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
            this.getQuestionnaireAnswers(questionnaireId)[questionId] = {
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
                    const q = currentQuestionnaire.questions.find(question =>
                        !this.getQuestionnaireAnswers(currentQuestionnaire.id)[question.id]
                    );

                    if (q) {
                        q.questionnaire = currentQuestionnaire;
                        return q;
                    }
                }
            });
    }

    getAnswer(questionnaireId, questionId) {
        return this.$q(resolve => {
            resolve(this.getQuestionnaireAnswers(questionnaireId)[questionId]);
        });
    }

    clear() {
        this.$localStorage.answers = undefined;
    }

    getAllAnswers() {
        this.$localStorage.answers = this.$localStorage.answers || {};
        return this.$localStorage.answers;
    }

    getQuestionnaireAnswers(questionnaireId) {
        const allAnswers = this.getAllAnswers();
        allAnswers[questionnaireId] = allAnswers[questionnaireId] || {};
        return allAnswers[questionnaireId];
    }
}

AnswersService.$inject = ['$q', '$localStorage'];

export default angular.module('services.answers', ['ngStorage'])
    .service('AnswerService', AnswersService)
    .name;