export default class HeaderController {
  constructor($state, $rootScope) {
    this.title = $state.current.data.title;

    $rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
      this.title = toState.data.title;
    });
  }
}

HeaderController.$inject = ['$state', '$rootScope'];