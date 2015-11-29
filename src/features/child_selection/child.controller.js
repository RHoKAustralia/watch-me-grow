'use strict';

export default class ChildSelectionController {
  constructor(childService, $location) {
    this.childService = childService;
    this.$location = $location
    this.children = this.childService.getChildren();
  }
}

ChildSelectionController.$inject = ['ChildService', '$location'];