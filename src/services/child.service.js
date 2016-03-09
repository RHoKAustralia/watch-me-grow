'use strict';

import angular from 'angular';
import 'ngstorage';
import _ from 'lodash';
import Child from '../models/Child';
import UserService from './user.service';
import 'aws-sdk/dist/aws-sdk';
const AWS = window.AWS;


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
      this.childrenPromise = this.$q((resolve, reject) => {
        AWS.config.credentials.get(err => {
          if (err) {
            reject(err);
            return;
          }
          this.cognitoSyncClient.listDatasets({
            IdentityId: AWS.config.credentials.identityId,
            IdentityPoolId: "us-east-1:e6b4594e-c060-4fbe-81dc-0d56af9b8ad3"
          }, function (err, data) {
            if (err) {
              reject(err);
            }

            if (data && data.children) {
              resolve(this.data.children.map(data => new Child(data)));
            } else {
              reject(new Error('no children'));
            }
          });
        });
      }).catch(e => {
        console.error(e.stack);
      });
    }

    return this.childrenPromise;
  }

  addChild(child) {
    this.$q((resolve, reject) => {
      this.childrenCache = [];

      this.cognitoSyncClient.listDatasets({
        IdentityId: this.userService.getLoginDetails().IdentityId,
        IdentityPoolId: "us-east-1:e6b4594e-c060-4fbe-81dc-0d56af9b8ad3"
      }, function (err, data) {
        if (err) {
          reject(err);
        }

        data.children = data.children || [];
        child.id = children.length;
        data.children.push(child);

        resolve();
      });
    }).then(() => {
      return this.$q((resolve, reject) => {
        this.cognitoSyncClient.bulkPublish({
          IdentityId: this.userService.getLoginDetails().IdentityId,
          IdentityPoolId: "us-east-1:e6b4594e-c060-4fbe-81dc-0d56af9b8ad3"
        }, function (err, data) {
          if (err) {
            reject(err);
          }

          resolve(data);
        });
      });
    });
  }
}

ChildService.$inject = ['$q', 'UserService'];

export default angular.module('services.child', ['ngStorage', UserService])
  .service('ChildService', ChildService)
  .name;