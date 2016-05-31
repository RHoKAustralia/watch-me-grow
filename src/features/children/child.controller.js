'use strict';

export default class ChildSelectionController {
  constructor(childService, ageService, $rootScope, userService, $mdDialog, $state) {
    this.childService = childService;
    this.ageService = ageService;
    this.userService = userService;
    this.$mdDialog = $mdDialog;
    this.$state = $state;

    $rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
      this.refreshChildren();
    });

    this.refreshChildren();
  }

  /**
   * Gets back a fresh list of children from the service.
   */
  refreshChildren() {
    this.loading = true;
    this.childService.getChildren().then((children = []) => {
      this.loading = false;
      this.children = children.map(child => ({
        metadata: child,
        age: this.ageService.getBestAge(child.getAgeInDays())
      }))
    });
  }

  /**
   * Displays a warning to the user that they're not logged in and they need to do so in order to properly save their
   * data.
   */
  warnNotLoggedIn(e) {
    if (!this.userService.isLoggedIn()) {
      e.preventDefault();
      const dialog =
        this.$mdDialog.alert()
          .parent(angular.element(document.body))
          .clickOutsideToClose(false)
          .title('Not Logged In')
          .textContent('You\'re not logged in - you can add children and take tests, but nothing will be permanently ' +
            'saved until you sign up or log in. When you sign up, anything you\'ve done will be associated with your new account')
          .ariaLabel('Not logged in warning')
          .ok('Got it!')
          .targetEvent(e);

      this.$mdDialog.show(dialog).then(() => this.$state.go('children.add'));
    }
  }
  
  /** Gets the title that will be displayed in the header at the top */
  getHeaderTitle() {
    return 'Choose Child'
  }
}

ChildSelectionController.$inject = ['ChildService', 'AgeService', '$rootScope', 'UserService', '$mdDialog', '$state'];