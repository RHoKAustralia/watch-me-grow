
export default class PostLoginController {
  constructor($state, userService) {
    const hashParams = window.location.hash.substring(1)
      .split("&")
      .map(pair => pair.split('='))
      .reduce((acc, pairArr) => {
        acc[pairArr[0]] = pairArr[1];
        return acc;
      }, {});

    userService.login(hashParams.access_token, parseInt(hashParams.expires_in)).then(() => $state.go('children'));
  }

  getHeaderTitle() {
    return 'Logging in...';
  }
}

PostLoginController.$inject = ['$state', 'UserService'];