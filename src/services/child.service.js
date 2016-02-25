'use strict';

import angular from 'angular';
import 'ngstorage';
import _ from 'lodash';
import Child from '../models/Child';

class ChildService {
  constructor($localStorage, $q) {
    this.$localStorage = $localStorage;
    this.$q = $q;
  }

  getChild(id) {
    return this.$q(resolve => resolve(this.getChildren()))
      .then(children => new Child(_.find(children, {'id': id})));
  }

  getChildren() {
    return this.$q(resolve => {
      if (!this.childrenCache && this.$localStorage.children) {
        this.childrenCache = this.$localStorage.children.map(data => new Child(data));
      }

      resolve(this.childrenCache);
    });
  }

  addChild(child) {
    this.$q(resolve => {
      this.childrenCache = [];

      var children = this.$localStorage.children || [];
      child.id = children.length;
      children.push(child);
      this.$localStorage.children = children;

      resolve();
    });
  }
}

ChildService.$inject = ['$localStorage', '$q'];

export default angular.module('services.child', ['ngStorage'])
  .service('ChildService', ChildService)
  .name;