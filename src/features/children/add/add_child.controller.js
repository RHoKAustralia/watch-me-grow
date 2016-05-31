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

  /**
   * Triggered when the user clicks OK on the dialog. If the child has a valid DOB, sets isSubmitting to true so the
   * UI can show a loading bar, then hides itself and hides the loading bar once successfully submitted.
   */
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

  /**
   * Cancels the dialog.
   */
  cancel($event) {
    $event.preventDefault();
    this.$mdDialog.cancel();
  }
}

AddChildController.$inject = ['ChildService', '$state', '$mdDialog'];