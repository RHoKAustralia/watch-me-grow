import React from 'react';

import Styles from './header.less';

const Header = React.createClass({
  render() {
    return (
      <header className={Styles.header}>
        <span className={Styles.logo}></span>
        <h1 className={Styles.title}>Watch Me Grow</h1>
      </header>
    );
  }
});

export default Header;