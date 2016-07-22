import React from 'react';
import { Link } from 'react-router';
import headerLogo from './wmg-header-logo.svg';

import Styles from './header.scss';

const Header = React.createClass({
    render() {
        return (
            <header className={Styles.header}>
                <svg className={Styles.logo} dangerouslySetInnerHTML={{__html: headerLogo}} />
                <h1 className={Styles.title}>Watch Me Grow</h1>
                <Link className={Styles.newChild} to="landing" activeClassName={Styles.active}>New Child</Link>
            </header>
        );
    }
});

export default Header;
