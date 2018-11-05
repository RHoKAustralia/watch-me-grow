import React from 'react';
import { Link } from 'react-router';
import headerLogo from './wmg-header-logo.svg';

import Styles from './header.scss';

class Header extends React.Component {
    render() {
        return (
            <header className={Styles.header}>
                <svg className={Styles.logo} dangerouslySetInnerHTML={{__html: headerLogo}} />
                <h1 className={Styles.title}>WatchMeGrow.care</h1>
                <Link className={Styles.newChild} to="landing" activeClassName={Styles.active}>New Child</Link>
            </header>
        );
    }
}

export default Header;
