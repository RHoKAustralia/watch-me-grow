import rootTemplate from './root.html';
import headerTemplate from './header/header.html';

routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('root', {
      url: '/',
      abstract: true,

      views: {

        /**
         * Base view for our root module which will get
         * attached hereafter defined views.
         */
        '': {
          template: rootTemplate,
          controller: 'RootController',
          controllerAs: 'root'
        }
      }
    });
}