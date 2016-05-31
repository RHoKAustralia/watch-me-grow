import locationSpecificHeaderTemplate from './location-specific-header.html';
import headerTemplate from './header.html';
import titleTemplate from './title.html';

/**
 * Sets up a header view for routing with a template that simply fills in the title with whatever the controller bound
 * returns from the getHeaderTitle() function.
 *
 * @param controllerName The name of the controller to bind to.
 */
export default function (views, controllerName) {
  views['title@root'] = {
    template: titleTemplate,
    controller: controllerName,
    controllerAs: 'controller'
  };

  views['header@root'] = {
    template: locationSpecificHeaderTemplate,
    controller: controllerName,
    controllerAs: 'controller'
  };

  views['general@root'] = {
    template: headerTemplate,
    controller: 'HeaderController',
    controllerAs: 'controller'
  };

  return views;
}