import State from './State';
import { stateList, motiveIconList } from '../../defaults';

export default class StateSnubItem extends State {
  constructor(params) {
    super(params);

    this.name = stateList.snubItem;
  }

  execute(self) {
    self.showMotive(motiveIconList.snubItem);
  }
}
