'use strict';

import angular from 'angular';
import localDataStorage from 'angular-local-storage';

class ChildService {
  constructor(localStorageService) {
    this.localStorageService = localStorageService
  }

  getChildren() {
    return this.localStorageService.get("children")
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