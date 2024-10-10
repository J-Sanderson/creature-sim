import { stateList, motiveIconList } from '../../defaults';

export const stateBounceToy = function (self) {
  self.setState(stateList.bounceToy);
  self.showMotive(motiveIconList.bounceToy);
};
