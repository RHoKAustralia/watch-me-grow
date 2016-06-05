'use strict';

import Moment from 'moment';

export default class EnterDetailsController {
  constructor(childService, $state) {
    this.childService = childService;
    this.$state = $state;
    this.child = {};
    this.isSubmitting = false;

    this.maxDate = Moment().subtract(6, 'months').toDate();
  }

  getHeaderTitle() {
    return "Enter Details";
  }

  /**
   * Triggered when the user clicks OK on the dialog. If the child has a valid DOB, sets isSubmitting to true so the
   * UI can show a loading bar, then hides itself and hides the loading bar once successfully submitted.
   */
  add($event) {
    $event.preventDefault();

    if (this.child.dob) {
      this.isSubmitting = true;
      this.childService.setChild(this.child)
        .then(() => {
          this.isSubmitting = false;
          this.$state.go('questionnaire');
        });
    }
  }
}

EnterDetailsController.$inject = ['ChildService', '$state'];