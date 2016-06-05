'use strict';

import angular from 'angular';
import 'ngstorage';
import _ from 'lodash';
import Child from '../models/child';
import UserService from './user.service';
import cbtp from '../util/cb-to-promise';
import uuid from 'node-uuid';
import cstp from '../util/cognito-sync-to-promise';
import getDataSet from '../util/get-data-set';

import 'amazon-cognito-js/dist/amazon-cognito.min';

/**
 * Adds and retrieves child data from Amazon Cognito.
 */
class ChildService {
  constructor($q, userService) {
    this.$q = $q;
    this.userService = userService;
    this.cognitoSyncClient = new AWS.CognitoSync();
  }

  /**
   * Gets a child for a given id.
   */
  getChild(id) {
    return getDataSet('children', this.userService, this.$q)
      .then(dataSet => {
        return cbtp.call(dataSet, this.$q, dataSet.get, id);
      })
      .then(childJson => new Child(JSON.parse(childJson)));
  }

  /**
   * Gets all of a user's children and caches the promise.
   */
  getChildren() {
    if (!this.childrenPromise) {
      this.childrenPromise = getDataSet('children', this.userService, this.$q)
        .then(dataSet => {
          return cbtp.call(dataSet, this.$q, dataSet.getAll);
        })
        .then(allData => {
          return _.values(allData)
            .filter(dataString => dataString.length > 0)
            .map(rawChild => new Child(JSON.parse(rawChild)))
        })
        .catch(e => {
          console.error(e.stack);
        });
    }

    return this.childrenPromise;
  }

  /**
   * Adds a child to a user's account.
   */
  addChild(child) {
    return getDataSet('children', this.userService, this.$q)
      .then(dataSet => {
        child.id = uuid.v1();
        return cbtp.call(dataSet, this.$q, dataSet.put, child.id, JSON.stringify(child)).then(() => dataSet);
      })
      .then(dataSet => cstp(this.$q, dataSet, true))
      .then(() => this.childrenPromise = undefined)
      .catch(e => {
        console.error(e.stack);
      });
  }
}

ChildService.$inject = ['$q', 'UserService'];

export default angular.module('services.child', ['ngStorage', UserService])
  .service('ChildService', ChildService)
  .name;