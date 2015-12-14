'use strict';

export default class AddChildController {
  constructor(childService, $state, $mdDialog) {
    this.childService = childService;
    this.$state = $state;
    this.child = {};
    this.$mdDialog = $mdDialog;

    this.maxDate = new Date();
  }

  add($event) {
    $event.preventDefault();

    if (child.dob) {
      this.childService.addChild(this.child);
      this.$mdDialog.hide();
    }
  }

  cancel($event) {
    $event.preventDefault();
    this.$mdDialog.cancel();
  }
}

AddChildController.$inject = ['ChildService', '$state', '$mdDialog'];