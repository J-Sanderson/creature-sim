import { stateList, motiveIconList } from '../../defaults';

export const statePushItemFromToybox = function (self) {
  self.setState(stateList.pushItemFromToybox);
  self.showMotive(motiveIconList.pushItemFromToybox);
};
