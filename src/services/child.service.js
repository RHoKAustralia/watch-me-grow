'use strict';

import angular from 'angular';
import 'ngstorage';
import _ from 'lodash';
import Child from '../models/Child';
import UserService from './user.service';
import cbtp from '../util/cb-to-promise';
import uuid from 'node-uuid';
import cstp from '../util/cognito-sync-to-promise';

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
        //.then(dataSet => cbtp.call(dataSet, this.$q, dataSet.remove, 'children').then(() => dataSet))
        .then(dataSet => cstp(this.$q, dataSet))
        .then(({dataSet}) => dataSet)
        .then(dataset => {
          return cbtp.call(dataset, this.$q, dataset.getAll);
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

  addChild(child) {
    return this.userService.init()
      .then(() => {
        const client = new AWS.CognitoSyncManager();

        return cbtp.call(client, this.$q, client.openOrCreateDataset, 'children');
      })
      .then(dataSet => {
        child.id = uuid.v1();
        return cbtp.call(dataSet, this.$q, dataSet.put, child.id, JSON.stringify(child)).then(() => dataSet);
      })
      .then(cstp(this.$q, dataSet))
      .then(({conflicts, dataSet}) => {
        if (conflicts) {
          console.log(conflicts);
        }

        return dataSet;
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