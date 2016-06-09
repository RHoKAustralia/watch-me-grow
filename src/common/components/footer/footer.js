import React from 'react';

import Styles from './footer.less';

const Header = React.createClass({
  render() {
    return (
      <footer className={Styles.footer}>
        <div className={Styles.inner}>
          <p className={Styles.blurb}>
            Watch Me Grow is supported by the University of New South Wales. It uses two well-established tools that
            ask about overall development, as well as language and social skills.
          </p>
        </div>
      </footer>
    );
  }
});

export default Header;