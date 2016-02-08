import _ from 'lodash';
import Moment from 'moment';

export default class QuestionnaireAnswer {
  constructor(data) {
    _.assign(this, data);

    this.completedMoment = Moment(this.dateTime);
  }
}