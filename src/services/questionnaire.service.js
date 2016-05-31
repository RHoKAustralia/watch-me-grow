'use strict';

import angular from 'angular';
import questionnaires from '../data/questionnaires';
import _ from 'lodash';

/**
 * Gets questionnaires from the questionnaires data json.
 */
class QuestionnaireService {
  constructor() {
    this.questionnaireIndex = _.keyBy(questionnaires, 'id');
  }

  getQuestionnaires() {
    return questionnaires;
  }

  getQuestionnaire(id) {
    return this.questionnaireIndex[id];
  }
}

export default angular.module('services.questions', [])
  .service('QuestionnaireService', QuestionnaireService)
  .name;