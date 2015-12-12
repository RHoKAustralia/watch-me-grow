'use strict';

export default class AddChildController {
  constructor(childService, $state, $mdDialog) {
    this.childService = childService
    this.$state = $state;
    this.child = {}
  }

  add() {
    this.childService.addChild(this.child);
    this.$state.go('children');
  }

  show() {
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('This is an alert title')
        .content('You can specify some description text in here.')
        .ariaLabel('Alert Dialog Demo')
        .ok('Got it!')
        .targetEvent(ev)
    );
  }
}

AddChildController.$inject = ['ChildService', '$state', '$mdDialog'];