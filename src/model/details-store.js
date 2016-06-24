import { observable } from 'mobx';
import emailValidator from 'email-validator';
import moment from 'moment';

const REQUIRED_TEXT = ['babyName', 'parentName', 'parentEmail'];
const LOCAL_STORAGE_KEY = 'wmg-details';

class DetailsStore {
  @observable babyName;
  @observable babyDob;
  @observable parentName;
  @observable parentEmail;

  @observable errors = {};

  constructor() {
    const fromStorageRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (fromStorageRaw) {
      const storedDetails = JSON.parse(fromStorageRaw);
      this.babyName = storedDetails.babyName;
      this.babyDob = moment(storedDetails.babyDob);
      this.parentName = storedDetails.parentName;
      this.parentEmail = storedDetails.parentEmail;
    }
  }

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
    } else if (this.babyDob.isAfter(moment().subtract(6, 'months'))) {
      errors.babyDob = 'Watch Me Grow is intended for babies older than 6 months';
    }

    this.errors = errors;

    return !Object.keys(errors).length;
  }

  save() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
      babyName: this.babyName,
      babyDob: this.babyDob.toString(),
      parentName: this.parentName,
      parentEmail: this.parentEmail
    }));
  }
}

export default DetailsStore;