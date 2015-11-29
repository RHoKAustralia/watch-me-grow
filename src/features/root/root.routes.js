routes.$inject = ['$stateProvider'];

import rootTemplate from './root.html';
import headerTemplate from '../header/header.html';

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
        },

        /**
         * Navbar view to be inserted with ui-view[name="header"]
         */
        'header@root': {
          template: headerTemplate,
          controller: 'HeaderController',
          controllerAs: 'header'
        }

      }
    });
}