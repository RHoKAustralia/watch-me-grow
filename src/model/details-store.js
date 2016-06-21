import { observable } from 'mobx';
import emailValidator from 'email-validator';

const REQUIRED_TEXT = ['babyName', 'parentName', 'parentEmail'];

class DetailsStore {
  @observable babyName;
  @observable babyDob;
  @observable parentName;
  @observable parentEmail;

  @observable errors = {};

  validate() {
    const errors = {};

    REQUIRED_TEXT.forEach(name => {
      if (!this[name] || !this[name].length) {
        errors[name] = 'Required';
      }
    });

    if (!errors.parentEmail && !emailValidator.validate(this.parentEmail)) {
      errors.parentEmail = 'This doesn\'t look like an email address - try checking it again?';
    }

    if (!this.babyDob) {
      errors.babyDob = 'Required';
    } else if (this.babyDob.isAfter(this.babyDob.subtract(6, 'months'))) {
      errors.babyDob = 'Watch Me Grow is intended for babies older than 6 months';
    }

    this.errors = errors;

    return !Object.keys(errors).length;
  }
}

export default DetailsStore;