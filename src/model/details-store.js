import { observable } from 'mobx';

class DetailsStore {
  @observable babyName = '';
  @observable babyDob;
  @observable parentName;
  @observable parentEmail;
}

export default DetailsStore;