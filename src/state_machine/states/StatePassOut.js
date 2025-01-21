import State from './State';
import { stateList, motiveList, motiveIconList } from '../../defaults';

export default class StatePassOut extends State {
  constructor(params) {
    super(params);

    this.name = stateList.passOut;
    this.suppressMotiveDecay.push(motiveList.energy);
  }

  execute(self, energy, maxVal) {
    self.showMotive(motiveIconList.passOut);
    let newVal = (energy += 1);
    if (newVal > maxVal) {
      newVal = maxVal;
    }
    self.setMotive(motiveList.energy, newVal);
  }
}
