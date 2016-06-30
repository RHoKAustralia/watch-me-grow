import React from 'react';
import DevTools from 'mobx-react-devtools';

import Header from './header/header';
import Footer from './footer/footer';
import Styles from './app.scss';
import ResultStore from '../model/result-store';
import Details from './stores/details';

const App = React.createClass({
  propTypes: {
    details: React.PropTypes.object.isRequired
  },

  componentWillMount() {
    this.setState({
      stores: {
        results: new ResultStore()
      }
    });
  },

  render() {
    return (
      <div className={Styles.app}>
        <Header />
        <div className={Styles.container}>
          {this.props.children && React.cloneElement(this.props.children, {
            stores: this.state.stores,
            details: this.props.details
          })}
        </div>
        <div className={Styles.spacer}/>
        <Footer />
        <DevTools />
      </div>
    );
  }
});

export default Details(App);