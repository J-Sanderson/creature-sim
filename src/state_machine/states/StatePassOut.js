import { stateList, motiveList, motiveIconList } from '../../defaults';

export const statePassOut = function (self, energy, maxVal) {
    self.setState(stateList.passOut);
    self.showMotive(motiveIconList.passOut);
    let newVal = (energy += 1);
    if (newVal > maxVal) {
      newVal = maxVal;
    }
    self.setMotive(motiveList.energy, newVal);
}
