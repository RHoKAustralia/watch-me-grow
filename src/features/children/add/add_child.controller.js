'use strict';

import Moment from 'moment';

export default class AddChildController {
  constructor(childService, $state, $mdDialog) {
    this.childService = childService;
    this.$state = $state;
    this.child = {};
    this.$mdDialog = $mdDialog;
    this.isSubmitting = false;

    this.maxDate = Moment().subtract(6, 'months').toDate();
  }

  add($event) {
    $event.preventDefault();

    if (this.child.dob) {
      this.isSubmitting = true;
      this.childService.addChild(this.child)
        .then(() => {
          this.$mdDialog.hide()
          this.isSubmitting = false;
        });
    }
  }

  cancel($event) {
    $event.preventDefault();
    this.$mdDialog.cancel();
  }
}

AddChildController.$inject = ['ChildService', '$state', '$mdDialog'];