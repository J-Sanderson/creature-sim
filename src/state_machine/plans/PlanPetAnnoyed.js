import { planList, stateList } from '../../defaults';

export const planPetAnnoyed = function (self) {
  self.setPlan(planList.petAnnoyed);
  self.setState(stateList.petAnnoyed);
  self.status.state.execute(self);
};
