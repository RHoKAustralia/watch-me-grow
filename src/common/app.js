import React from 'react';
import DevTools from 'mobx-react-devtools';

import Header from './header/header';
import Footer from './footer/footer';
import Styles from './app.less';
import ResultStore from '../model/result-store';
import DetailsStore from '../model/details-store';

export default ({children}) => {
  const stores = {
    results: new ResultStore(),
    details: new DetailsStore()
  };

  return (
    <div className={Styles.app}>
      <Header />
      <div className={Styles.container}>
        {children && React.cloneElement(children, {
          stores
        })}
      </div>
      <div className={Styles.spacer}/>
      <Footer />
      <DevTools />
    </div>
  );
}