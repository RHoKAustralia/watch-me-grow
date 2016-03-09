'use strict';

import defineHeader from '../root/header/define-header';

routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('postLogin', {
      url: 'postLogin',
      parent: 'root',
      onEnter: ['UserService', '$state', (userService, $state) => {
        const hashParams = window.location.hash.substring(1)
          .split("&")
          .map(pair => pair.split('='))
          .reduce((acc, pairArr) => {
            acc[pairArr[0]] = pairArr[1];
            return acc;
          }, {});

        userService.login(hashParams.access_token, parseInt(hashParams.expires_in)).then(() => $state.go('children'));
      }]
    });
}