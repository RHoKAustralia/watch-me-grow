'use strict';

export default class ChildSelectionController {
  constructor(childService, $location) {
    this.childService = childService;
    this.$location = $location
    this.children = this.childService.getChildren();
    this.imagePath = require('../../../assets/dog.png');
  }
}

ChildSelectionController.$inject = ['ChildService', '$location'];