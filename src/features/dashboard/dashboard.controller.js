'use strict';

import questions from '../../data/questionnaires';
import ages from '../../data/ages';
import _ from 'lodash';
import {combineQuestionsAndAnswers, getOverallResult} from '../../models/data.functions';
import moment from 'moment';

const CSV_HEADER = ['Questionnaire ID', 'Questionnaire Name', 'Date/Time', 'Child Name', 'Result Flag'];

export default class DashboardController {
  constructor(answerService, $stateParams, childService, questionnaireService, ageService, $q) {
    this.childId = $stateParams.childId;
    this.childService = childService;
    this.ageService = ageService;
    this.answerService = answerService;
    this.questionnaireService = questionnaireService;
    this.$q = $q;
    this.completed = [];

    this.toDos = this.questionnaireService.getQuestionnaires();
  }

  getInfo() {
    if (!this.infoPromise) {
      this.loading = true;

      this.childInfoPromise = this._getChildPromise()
        .then(() => {
          this.age = this.ageService.getBestAge(this.child.getAgeInDays());
        });

      // Keep the response promise for CSV generation
      this.responsePromise = this.answerService.getResponsesForChild(this.childId);

      // When the response promise is done, provide completed questionnaires for the UI.
      this.responsePromise.then(responses => {
        this.completed = responses.map(response => ({
          id: response.id,
          date: moment(response.modified).format('LL'),
          age: this.ageService.getAgeById(response.ageId)
        }))
      });

      this.infoPromise = this.$q.all([this.childInfoPromise, this.responsePromise]).then(() => this.loading = false);
    }

    return this.infoPromise;
  }

  _getChildPromise() {
    if (!this.childPromise) {
      this.childPromise = this.childService.getChild(this.childId).then(child => this.child = child);
    }

    return this.childPromise;
  }

  getChild() {
    this._getChildPromise();

    return this.child;
  }

  getAge() {
    if (this.age) {
      return this.age;
    } else {
      this.getInfo();
    }
  }

  getCompleted() {
    if (this.completed) {
      return this.completed;
    } else {
      this.getInfo();
    }
  }

  getHeaderTitle() {
    this._getChildPromise();

    return !this.child ? 'Loading...' : 'Dashboard for ' + this.child.name;
  }

  // TODO: Do this on demand somehow?
  getReportCsvHref() {
    if (!this.csvHrefPromise) {
      this.getInfo();
      this.csvHrefPromise = this.responsePromise.then(responses => {
        const completed = _.flatMap(responses, response => (
          _.map(response.questionnaires, (results, questionnaireId) => {
            const questionnaire = this.questionnaireService.getQuestionnaire(questionnaireId);
            const combinedQuestions = combineQuestionsAndAnswers(questionnaire.questions, results);

            return ({
              combinedQuestions,
              questionnaire,
              flag: getOverallResult(questionnaire, combinedQuestions),
              modified: response.modified
            });
          })
        ));

        const results = [CSV_HEADER].concat(completed.map(completed => {
          const list = [
            completed.questionnaire.id,
            completed.questionnaire.title,
            completed.modified,
            this.child.name,
            completed.flag
          ];

          completed.combinedQuestions.forEach(question => {
            list.push(question.metadata.text);
            list.push(question.answer.metadata.text);
            list.push(question.answer.comments);
          });

          return list;
        }));

        const longestRow = results.reduce((longest, current) => current.length >= longest ? current.length : longest, 0);
        const answerHeadingsNeeded = (longestRow - CSV_HEADER.length) / 3;
        for (let i = 1; i <= answerHeadingsNeeded; i++) {
          results[0].push("Question " + i);
          results[0].push("Answer for Question " + i);
          results[0].push("Comments for Question " + i);
        }

        const csv = results.reduce((textSoFar, row) => {
          const escaped = '"' + row.map(value => value ? value.replace(/"/g, '\'') : '').join('","') + '"\n'

          return textSoFar + escaped;
        }, '');

        this.csvHref = 'data:attachment/csv,' + encodeURIComponent(csv);
      });
    }

    return this.csvHref;
  }
}

DashboardController.$inject = ['AnswerService', '$stateParams', 'ChildService', 'QuestionnaireService', 'AgeService', '$q'];