import { stateList, motiveIconList } from '../../defaults';

export const stateMissingItem = function (self) {
  self.setState(stateList.missingIcon);
  self.showMotive(motiveIconList.missingItem);
};
