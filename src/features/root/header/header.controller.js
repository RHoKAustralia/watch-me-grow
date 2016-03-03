'use strict';

export default class HeaderController {
  constructor(userService) {
    this.userService = userService;
  }

  isLoggedIn() {
    return this.userService.isLoggedIn();
  }
}

HeaderController.$inject = ['UserService'];