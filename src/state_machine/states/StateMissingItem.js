import { stateList, motiveIconList } from '../../defaults';

export const stateMissingItem = function (self) {
  self.setState(stateList.missingItem);
  self.showMotive(motiveIconList.missingItem);
};
