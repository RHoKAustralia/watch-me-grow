'use strict';

import questions from '../../data/questionnaires';
import ages from '../../data/ages';
import _ from 'lodash';
import {combineQuestionsAndAnswers, getOverallResult} from '../../models/data.functions';

const CSV_HEADER = ['Questionnaire ID', 'Questionnaire Name', 'Date/Time', 'Child Name', 'Result Flag'];

export default class DashboardController {
  constructor(answerService, $stateParams, childService, questionnaireService, ageService) {
    this.answerService = answerService;
    this.child = childService.getChild($stateParams.childId);
    this.age = ageService.getBestAge(this.child.getAgeInDays());
    this.questionnaireService = questionnaireService;
    this.completed = [];

    this.answerService.getResultsForChild(this.child.id).then((childAnswers = {}) => {
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
              age: ageService.getAgeById(questionnaireAnswers.ageId)
            }
          });
    });

    this.toDos = this.questionnaireService.getQuestionnaires();

    this.reportCsvHref = this.generateReportCsvHref();
  }

  getHeaderTitle() {
    return 'Dashboard for ' + this.child.name;
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