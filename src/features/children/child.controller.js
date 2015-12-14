'use strict';

export default class ChildSelectionController {
  constructor(childService, $location) {
    this.childService = childService;
    this.$location = $location
    this.imagePath = require('../../../assets/dog.png');
  }

  getChildren() {
    return this.childService.getChildren();
  }
}

ChildSelectionController.$inject = ['ChildService', '$location'];