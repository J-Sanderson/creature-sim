import { stateList, motiveIconList } from '../../defaults';

export const stateAddedItem = function (self) {
  self.setState(stateList.addedItem);
  self.showMotive(motiveIconList.addedItem);
};
