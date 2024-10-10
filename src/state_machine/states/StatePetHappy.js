import { stateList, motiveIconList } from '../../defaults';

export const statePetHappy = function (self) {
  self.setState(stateList.petHappy);
  self.showMotive(motiveIconList.petHappy);
};
