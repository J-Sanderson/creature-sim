import State from './State';
import { stateList, motiveIconList } from '../../defaults';

export default class StateSitAround extends State {
  constructor(params) {
    super(params);

    this.name = stateList.sitAround;
  }

  execute(self) {
    self.showMotive(motiveIconList.sitAround);
  }
}
