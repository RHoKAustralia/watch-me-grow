import React from 'react';
import {Link} from 'react-router';

import Styles from './header.scss';

const Header = React.createClass({
    render() {
        return (
            <header className={Styles.header}>
                <span className={Styles.logo} />
                <h1 className={Styles.title}>Watch Me Grow</h1>
                <Link className={Styles.newChild} to="landing" activeClassName={Styles.active}>New Child</Link>
            </header>
        );
    }
});

export default Header;
