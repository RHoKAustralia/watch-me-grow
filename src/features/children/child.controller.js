'use strict';

export default class ChildSelectionController {
  constructor(childService, ageService, $rootScope) {
    this.childService = childService;
    this.ageService = ageService;

    $rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
      this.refreshChildren();
    });

    this.refreshChildren();
  }

  refreshChildren() {
    this.children = (this.childService.getChildren() || [])
      .map(child => ({
        metadata: child,
        age: this.ageService.getBestAge(child.getAgeInDays())
      }));
  }

  getHeaderTitle() {
    return 'Choose Child'
  }
}

ChildSelectionController.$inject = ['ChildService', 'AgeService', '$rootScope'];