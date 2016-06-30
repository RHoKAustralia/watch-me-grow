import React from 'react';

import Header from './header/header';
import Footer from './footer/footer';
import Styles from './app.scss';
import withDetailsStore from './stores/details-store';
import withResultsStore from './stores/results-store';

const App = React.createClass({
  propTypes: {
    details: React.PropTypes.object.isRequired,
    results: React.PropTypes.object.isRequired
  },

  render() {
    return (
      <div className={Styles.app}>
        <Header />
        <div className={Styles.container}>
          {this.props.children && React.cloneElement(this.props.children, {
            results: this.props.results,
            details: this.props.details
          })}
        </div>
        <div className={Styles.spacer}/>
        <Footer />
      </div>
    );
  }
});

export default withResultsStore(withDetailsStore((App)));