import React from 'react';
import Header from './header/header';
import Footer from './footer/footer';
import Styles from './app.less';

export default ({children}) => {
  return (
      <div className={Styles.app}>
        <Header />
        <div className={Styles.container}>
          {children}
        </div>
        <div className={Styles.spacer}/>
        <Footer />
      </div>
  );
}