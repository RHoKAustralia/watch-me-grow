'use strict';

import angular from 'angular';
import localDataStorage from 'angular-local-storage';
import _ from 'lodash';
import Child from '../models/Child';

class ChildService {
  constructor(localStorageService) {
    this.localStorageService = localStorageService
  }

  getChild(id) {
    return new Child(_.find(this.localStorageService.get("children"), {'id': id}));
  }

  getChildren() {
    const children = this.localStorageService.get("children");
    if (children) {
      return children.map(data => new Child(data));
    }
  }

  addChild(child) {
    var children = this.getChildren();
    if(children == null) {
      children = []
    }
    child.id = children.length;
    children.push(child);
    this.localStorageService.set("children", children)
  }

}

ChildService.$inject = ["localStorageService"];

export default angular.module('services.child', ['LocalStorageModule'])
  .service('ChildService', ChildService)
  .name;