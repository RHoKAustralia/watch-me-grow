import React from 'react';
import classNames from 'classnames';

import Styles from './footer.scss';

const Header = React.createClass({
    propTypes: {
        concern: React.PropTypes.bool
    },

    render() {
        return (
            <footer className={classNames(Styles.footer, {[Styles.concern]: this.props.concern})}>
                <div className={Styles.inner}>
                    <p className={Styles.blurb}>
                        Watch Me Grow is supported by the University of New South Wales. It uses two well-established
                        tools that
                        ask about overall development, as well as language and social skills.
                    </p>
                </div>
            </footer>
        );
    }
});

export default Header;
