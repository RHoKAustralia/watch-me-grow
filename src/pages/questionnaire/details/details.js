import React from 'react';

import Styles from './details.less';
import TextField from 'material-ui/TextField';

const Details = React.createClass({
  render() {
    return (
      <div className={Styles.details}>
        <TextField
          floatingLabelText="Your Baby's Name"
        />
      </div>
    );
  }
});

export default Details;