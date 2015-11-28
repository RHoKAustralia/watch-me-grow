'use strict';

export default class ChildSelectionController {
  constructor(childService, $location) {
    this.childService = childService
    this.$location = $location
  }

  getChildren() {
    return this.childService.getChildren();
  }

  addChild() {
    this.$location.path('/add_child')
  }
}

ChildSelectionController.$inject = ['ChildService', '$location'];