import { stateList, motiveIconList } from '../../defaults';

export const stateSitAround = function (self) {
  self.setState(stateList.sitAround);
  self.showMotive(motiveIconList.sitAround);
};
