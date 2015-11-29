'use strict';

export default class AddChildController {
  constructor(childService, $state) {
    this.childService = childService
    this.$state = $state;
    this.child = {}
  }

  add() {
    this.childService.addChild(this.child);
    this.$state.go('child_selection');
  }
}

AddChildController.$inject = ['ChildService', '$state'];