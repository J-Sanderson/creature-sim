import { stateList, motiveIconList } from '../../defaults';

export const statePetAnnoyed = function (self) {
  self.setState(stateList.petAnnoyed);
  self.showMotive(motiveIconList.petAnnoyed);
};
