'use strict';

export default class HeaderController {
  constructor(userService, $state) {
    this.userService = userService;
    this.$state = $state;
  }

  logout() {

    // Quick and dirty way to clear every cache etc.
    window.location.reload();
  }

  isLoggedIn() {
  }

  getLoginDetails() {
  }

  onLoginClicked(e) {
    e.preventDefault();
  }
}

HeaderController.$inject = ['UserService', '$state'];