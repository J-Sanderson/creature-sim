import State from './State';
import { stateList, motiveIconList } from '../../defaults';

export default class StateAddedItem extends State {
  constructor(params) {
    super(params);

    this.name = stateList.addedItem;
  }

  execute(self) {
    self.showMotive(motiveIconList.addedItem);
  }
}
