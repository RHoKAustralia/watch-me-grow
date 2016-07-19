import React from 'react';
import classNames from 'classnames';

import Header from './header/header';
import Footer from './footer/footer';
import Styles from './app.scss';
import withDetailsStore from './stores/details-store';
import withResultsStore from './stores/results-store';

const App = React.createClass({
  propTypes: {
    details: React.PropTypes.object,
    results: React.PropTypes.object
  },

  render() {
    return (
      <div className={classNames(Styles.app, {[Styles.concern]: this.props.results.concern})}>
        <Header />
        <div className={Styles.container}>
          {this.props.children && React.cloneElement(this.props.children, {
            results: this.props.results,
            details: this.props.details
          })}
        </div>
        <div className={Styles.spacer}/>
        <Footer concern={this.props.results.concern} />
      </div>
    );
  }
});

export default withResultsStore(withDetailsStore((App)));
