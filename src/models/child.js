import _ from 'lodash';
import Moment from 'moment';

export default class Child {
  constructor(data) {
    _.assign(this, data);
  }

  getAgeInDays() {
    return Moment().diff(Moment(this.dob), 'days');
  }
}