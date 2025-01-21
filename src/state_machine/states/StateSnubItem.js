import State from './State';
import { stateList, motiveIconList } from '../../defaults';

export default class StateSnubItem extends State {
  constructor(params) {
    super(params);
  }

  execute(self) {
    self.showMotive(motiveIconList.snubItem);
  }
}
