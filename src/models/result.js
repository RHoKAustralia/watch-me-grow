import _ from 'lodash';
import Moment from 'moment';

export default class Result {
  constructor(data) {
    _.assign(this, data);

    this.completedMoment = Moment(this.dateTime);
  }
}