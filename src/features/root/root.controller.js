import {syncsInProgress} from '../../util/cognito-sync-to-promise';
import _ from 'lodash';

export default class RootController {
  constructor($mdDialog, userService, $rootScope, $timeout) {
    this.$mdDialog = $mdDialog;
    this.$timeout = $timeout;
    this.showingLoginLoader = false;

    $rootScope.$watch(() => {
      if (userService.loggingIn) {
        if (!this.showingLoginLoader) {
          this.showLoginLoader();
        }
      } else {
        if (this.showingLoginLoader) {
          this.hideLoginLoader();
        }
      }
    });
  }

  showLoginLoader() {
    if (!this.timeout) {
      this.timeout = this.$timeout(() => {
        this.showingLoginLoader = true;
        this.$mdDialog.show({
          template: require('./login-loader.html'),
          parent: document.body,
          clickOutsideToClose: false
        });
        this.timeout = undefined;
      }, 300);
    }
  }

  hideLoginLoader() {
    this.$mdDialog.hide();
    this.showingLoginLoader = false;
  }

  loading() {
    return Object.keys(syncsInProgress).length > 0;
  }
}

RootController.$inject = ['$mdDialog', 'UserService', '$rootScope', '$timeout'];