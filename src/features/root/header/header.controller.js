'use strict';

const DAILY_CRED_ID = '7af5e26d-cf13-47e1-b74b-f93a66fd318f';
const RETURN_URL = `${window.location.protocol}//${window.location.host}/watch-me-grow/postLogin`;

export default class HeaderController {
  constructor(userService, $state) {
    this.userService = userService;
    this.$state = $state;

    this.loginUrl = `https://www.dailycred.com/oauth/authorize?response_type=token&redirect_uri=${RETURN_URL}&simple=false&client_id=${DAILY_CRED_ID}`;
  }

  logout() {
    this.userService.logout();

    setTimeout(() => {
      window.location.reload();
    }, 500);
  }

  isLoggedIn() {
    return this.userService.isLoggedIn();
  }

  onLoginClicked(e) {
    e.preventDefault();

    this.userService.clearCredentials();

    window.location = this.loginUrl;
  }
}

HeaderController.$inject = ['UserService', '$state'];