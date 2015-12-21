import headerTemplate from '../header/header.html';
import './header.scss';

/**
 * Sets up a header view for routing with a template that simply fills in the title with whatever the controller bound
 * returns from the getHeaderTitle() function.
 *
 * @param controllerName The name of the controller to bind to.
 */
export default function(controllerName) {
  return {
    controller: controllerName,
    template: headerTemplate,
    controllerAs: 'controller'
  };
}