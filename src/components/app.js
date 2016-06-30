import React from 'react';
import DevTools from 'mobx-react-devtools';

import Header from './header/header';
import Footer from './footer/footer';
import Styles from './app.scss';
import ResultStore from '../model/result-store';
import DetailsStore from '../model/details-store';

const App = React.createClass({
  componentWillMount() {
    this.setState({
      stores: {
        results: new ResultStore(),
        details: new DetailsStore()
      }
    });
  },

  render() {
    return (
      <div className={Styles.app}>
        <Header />
        <div className={Styles.container}>
          {this.props.children && React.cloneElement(this.props.children, {
            stores: this.state.stores
          })}
        </div>
        <div className={Styles.spacer}/>
        <Footer />
        <DevTools />
      </div>
    );
  }
});

export default App;