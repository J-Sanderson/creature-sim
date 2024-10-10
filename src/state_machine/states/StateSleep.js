import { motiveList, stateList, motiveIconList } from '../../defaults';

export const stateSleep = function (self, energy, maxVal) {
  self.setState(stateList.sleep);
  self.showMotive(motiveIconList.sleep);
  let newVal = (energy += 1);
  if (newVal > maxVal) {
    newVal = maxVal;
  }
  self.setMotive(motiveList.energy, newVal);
};
