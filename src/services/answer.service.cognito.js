'use strict';

import angular from 'angular';
import _ from 'lodash';
import moment from 'moment';
import QuestionnaireAnswer from '../models/result';
import uuid from 'node-uuid';
import cbtp from '../util/cb-to-promise';
import cstp from '../util/cognito-sync-to-promise';
import getDataSet from '../util/get-data-set';
import UserService from './user.service';

const CHILD_TO_RESPONSES_DS_NAME = 'childToResponses';
const RESPONSES_DATASET_NAME = 'responses';

/**
 * Adds and retrieves answers from Amazon Cognito.
 * 
 * @see the Cognito API docs.
 */
class AnswersService {
  constructor($q, userService, $localStorage) {
    this.$q = $q;
    this.userService = userService;
    this.$localStorage = $localStorage;

    this.responseAddCache = {};
    this.responseGetCache = {};
  }

  /**
   * Gets all responses for a child by first retrieving all of the ids of their responses, then retrieving the
   * response for each id.
   */
  getResponsesForChild(childId) {
    return this._getResponseIdsForChildWithDataSet(childId)
      .then(({responseIds}) => this.$q.all(responseIds.map(id => this.getResponseById(id))))
  }

  /**
   * Gets all the response ids for a child.  
   */
  _getResponseIdsForChildWithDataSet(childId) {
    return this.$q((resolve, reject) => {
      this.$localStorage.responses[childId]
    });

    return getDataSet(CHILD_TO_RESPONSES_DS_NAME, this.userService, this.$q)
      .then(dataSet =>  cbtp.call(dataSet, this.$q, dataSet.get, childId)
        .then(json => ({
          dataSet, json
        }))
      )
      .then(({dataSet, json = '[]'}) => ({
        responseIds: JSON.parse(json), dataSet
      }));
  }

  /** Gets a passed response with the passed id */
  getResponseById(id) {
    return this._getResponseByIdWithDataSet(id).then(result => result.response);
  }

  /**
   * Gets the response for the passed ID, returning both the parsed response object and a reference to the
   * Cognito dataset in case further operations need to be made with it.
   */
  _getResponseByIdWithDataSet(id) {
    if (!this.responseGetCache[id]) {
      this.responseGetCache[id] = getDataSet(RESPONSES_DATASET_NAME, this.userService, this.$q)
        .then(dataSet => cbtp.call(dataSet, this.$q, dataSet.get, id).then(json => ({json, dataSet})))
        .then(({json = '{}', dataSet}) => ({
          response: JSON.parse(json),
          dataSet
        }));
    }

    return this.responseGetCache[id]
  }

  /**
   * Adds a response for a child.
   * 
   * @param childId the id of the child.
   * @param ageId the age to associate with the result.
   */
  addResponse(childId, ageId) {
    const key = `${childId}-${ageId}`;

    if (!this.responseAddCache[key]) {
      const id = uuid.v1();

      const response = {
        id,
        ageId,
        created: moment().toISOString(),
        modified: moment().toISOString(),
        childId,
        questionnaires: {}
      };

      // Add the response to the responses datastore 
      const responsesPromise = getDataSet(RESPONSES_DATASET_NAME, this.userService, this.$q)
        .then(dataSet => cbtp.call(dataSet, this.$q, dataSet.put, id, JSON.stringify(response)).then(() => dataSet))
        .then(dataSet => cstp(this.$q, dataSet, true));

      // Add the id of the response to the childToResponses datastore - this is necessary because Cognito isn't an RDBMS 
      const addResponseIdToChildPromise = this._getResponseIdsForChildWithDataSet(childId)
        .then(({responseIds, dataSet}) => cbtp.call(dataSet, this.$q, dataSet.put, childId, JSON.stringify(responseIds.concat(id)))
          .then(() => dataSet)
        )
        .then(dataSet => cstp(this.$q, dataSet, true));

      // We cache the add operation just in case multiples get triggered - we only want one per child/age combination.
      this.responseAddCache[key] = this.$q.all(responsesPromise, addResponseIdToChildPromise).then(() => response);
    }

    return this.responseAddCache[key];
  }

  /**
   * Adds a result for a single questionnaire to a response (a response is multiple questionnaire results).
   */
  addAnswersToResponse(responseId, questionnaireId, answers) {
    delete this.responseGetCache[responseId];

    return this._getResponseByIdWithDataSet(responseId)
      .then(({response, dataSet}) => {
        response.questionnaires[questionnaireId] = answers;
        response.modified = moment().toISOString();

        return cbtp.call(dataSet, this.$q, dataSet.put, responseId, JSON.stringify(response)).then(() => ({
          dataSet,
          response
        }));
      })
      .then(({dataSet, response}) => cstp(this.$q, dataSet, true).then(() => response))
      .catch(e => {
        console.error(e.stack);
      });
  }
}

AnswersService.$inject = ['$q', 'UserService'];

export default angular.module('services.answers', ['ngStorage'])
  .service('AnswerService', AnswersService)
  .name;