import State from './State';
import { motiveList, stateList, motiveIconList } from '../../defaults';

export default class StateSleep extends State {
  constructor(params) {
    super(params);

    this.name = stateList.sleep;
  }

  execute(self, energy, maxVal) {
    self.showMotive(motiveIconList.sleep);
    let newVal = (energy += 1);
    if (newVal > maxVal) {
      newVal = maxVal;
    }
    self.setMotive(motiveList.energy, newVal);
  }
}
