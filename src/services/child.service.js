'use strict';

import angular from 'angular';
import 'ngstorage';
import _ from 'lodash';
import Child from '../models/Child';
import UserService from './user.service';
import cbtp from '../util/cb-to-promise'


//import 'aws-sdk/dist/aws-sdk';
//const AWS = window.AWS;

import 'amazon-cognito-js/dist/amazon-cognito.min';

class ChildService {
  constructor($q, userService) {
    this.$q = $q;
    this.userService = userService;
    this.cognitoSyncClient = new AWS.CognitoSync();
  }

  getChild(id) {
    return this.$q(resolve => resolve(this.getChildren()))
      .then(children => new Child(_.find(children, {'id': id})));
  }

  getChildren() {
    if (!this.childrenPromise) {

      this.childrenPromise = this.userService.init()
        .then(() => {
          const client = new AWS.CognitoSyncManager();
          return cbtp.call(client, this.$q, client.openOrCreateDataset, 'children')
        })
        .then(dataSet => {
          return this.$q((resolve, reject) => dataSet.synchronize({
            onSuccess: function (dataset, newRecords) {
              resolve(dataSet);
            },

            onFailure: function (err) {
              reject(err);
            }
          }));
        })
        .then(dataset => {
          return cbtp.call(dataset, this.$q, dataset.get, 'children');
        })
        .then(childrenJson => childrenJson ? JSON.parse(childrenJson) : [])
        .then(children => children.map(childData => new Child(childData)))
        .catch(e => {
          console.error(e.stack);
        });
    }

    return this.childrenPromise;
  }

  addChild(child) {
    return  this.userService.init()
      .then(() => {
        const client = new AWS.CognitoSyncManager();

        return cbtp.call(client, this.$q, client.openOrCreateDataset, 'children');
      })
      .then(dataSet => {
        return cbtp.call(dataSet, this.$q, dataSet.get, 'children')
          .then(childrenJson => childrenJson ? JSON.parse(childrenJson) : [])
          .then(children => ({dataSet, children}));
      })
      .then(({dataSet, children = []}) => {
        child.id = children.length;
        children.push(child);
        return cbtp.call(dataSet, this.$q, dataSet.put, 'children', JSON.stringify(children)).then(() => dataSet);
      })
      .then(dataSet => {
        return this.$q((resolve, reject) => {
          dataSet.synchronize({
            onSuccess: function (dataset, newRecords) {
              resolve();
            },

            onFailure: function (err) {
              reject(err);
            },

            onConflict: function (dataset, conflicts, callback) {
              reject(new Error('conflict'));
            },

            onDatasetDeleted: function (dataset, datasetName, callback) {
              return callback(true);
            },

            onDatasetMerged: function (dataset, datasetNames, callback) {
              return callback(false);
            }
          });
        });
      })
      .catch(e => {
        console.error(e.stack);
      });
  }
}

ChildService.$inject = ['$q', 'UserService'];

export default angular.module('services.child', ['ngStorage', UserService])
  .service('ChildService', ChildService)
  .name;