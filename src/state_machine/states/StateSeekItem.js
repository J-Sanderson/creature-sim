import State from './State';
import { stateList } from '../../defaults';

export default class StateSeekItem extends State {
  constructor(params) {
    super(params);
  }

  execute(self, motive) {
    if (motive) {
      self.showMotive(motive);
    }
  }
}
