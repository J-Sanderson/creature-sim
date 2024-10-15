import { stateList, motiveIconList } from '../../defaults';

export const stateSnubItem = function (self) {
  self.setState(stateList.snubItem);
  self.showMotive(motiveIconList.snubItem);
};
