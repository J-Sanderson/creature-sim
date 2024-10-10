import { stateList, motiveIconList } from '../../defaults';

export const stateChewToy = function (self) {
  self.setState(stateList.chewToy);
  self.showMotive(motiveIconList.chewToy);
};
