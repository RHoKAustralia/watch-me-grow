import React from 'react';

import Styles from './result.scss';

const Result = React.createClass({
  componentWillMount() {
    this.props.results.mark();
  },

  render() {
    return (
      <article className={Styles.root}>
        <span className={Styles.icon}></span>
        <h3>
          Your answers indicate that your child could benefit from a more detailed
          assessment by a GP or another health professional.
        </h3>
      </article>
    );
  }
});

export default Result;