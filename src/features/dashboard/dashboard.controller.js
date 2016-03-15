'use strict';

import questions from '../../data/questionnaires';
import ages from '../../data/ages';
import _ from 'lodash';
import {combineQuestionsAndAnswers, getOverallResult} from '../../models/data.functions';

const CSV_HEADER = ['Questionnaire ID', 'Questionnaire Name', 'Date/Time', 'Child Name', 'Result Flag'];

export default class DashboardController {
  constructor(answerService, $stateParams, childService, questionnaireService, ageService) {
    this.childId = $stateParams.childId;
    this.childService = childService;
    this.ageService = ageService;
    this.answerService = answerService;
    this.questionnaireService = questionnaireService;
    this.completed = [];

    this.toDos = this.questionnaireService.getQuestionnaires();
    this.reportCsvHref = this.generateReportCsvHref();
  }

  getInfo() {
    if (!this.infoPromise) {
      this.infoPromise = this._getChildPromise()
        .then(() => {
          this.age = this.ageService.getBestAge(this.child.getAgeInDays());

          return this.answerService.getResultsForChild(this.child.id)
        })
        .then((childAnswers = {}) => {
          this.completed =
            Object.keys(childAnswers)
              .map(key => childAnswers[key])
              .map(questionnaireAnswers => {
                const questionnaire = this.questionnaireService.getQuestionnaire(questionnaireAnswers.questionnaireId);
                const combinedQuestions = combineQuestionsAndAnswers(questionnaire.questions, questionnaireAnswers.answers);

                return {
                  result: questionnaireAnswers,
                  questionnaire,
                  combinedQuestions,
                  flag: getOverallResult(questionnaire, combinedQuestions),
                  age: this.ageService.getAgeById(questionnaireAnswers.ageId)
                }
              });
        });
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
    }
    return this.getInfo().then(() => this.age);
  }

  getCompleted() {
    if (this.completed) {
      return this.completed;
    }
    return this.getInfo().then(() => this.completed);
  }

  getHeaderTitle() {
    this._getChildPromise();

    return !this.child ? 'Loading...' : 'Dashboard for ' + this.child.name;
  }

  generateReportCsvHref() {
    const results = [CSV_HEADER].concat(this.completed.map(completed => {
      const list = [
        completed.questionnaire.id,
        completed.questionnaire.title,
        completed.result.dateTime,
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

    return 'data:attachment/csv,' + encodeURIComponent(csv);
  }
}

DashboardController.$inject = ['AnswerService', '$stateParams', 'ChildService', 'QuestionnaireService', 'AgeService'];