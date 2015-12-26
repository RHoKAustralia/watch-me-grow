'use strict';

import angular from 'angular';
import 'ngstorage';
import _ from 'lodash';
import Child from '../models/Child';

class ChildService {
  constructor($localStorage) {
    this.$localStorage = $localStorage;
  }

  getChild(id) {
    return new Child(_.find(this.getChildren(), {'id': id}));
  }

  getChildren() {
    if (!this.childrenCache && this.$localStorage.children) {
      this.childrenCache = this.$localStorage.children.map(data => new Child(data));
    }

    return this.childrenCache;
  }

  addChild(child) {
    delete this.childrenCache;

    var children = this.$localStorage.children || [];
    child.id = children.length;
    children.push(child);
  }

}

ChildService.$inject = ["$localStorage"];

export default angular.module('services.child', ['ngStorage'])
  .service('ChildService', ChildService)
  .name;