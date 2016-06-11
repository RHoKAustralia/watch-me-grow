import React from 'react';
import Styles from './card.less';
import classNames from 'classnames';

const Card = React.createClass({
  propTypes: {
    className: React.PropTypes.string,
    fullWidth: React.PropTypes.bool
  },

  render() {
    return (
      <section className={classNames(
      Styles.card, 
      this.props.className,
      Styles.fullWidth)}>
        {this.props.children}
      </section>
    );
  }
});

export default Card;