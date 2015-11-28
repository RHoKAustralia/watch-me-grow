'use strict';

export default class AddChildController {
  constructor(childService, $location) {
    this.childService = childService
    this.$location = $location
    this.child = {}
  }

  add() {
    this.childService.addChild(this.child);
    this.$location.path('/child_selection')
  }
}

AddChildController.$inject = ['ChildService', '$location'];