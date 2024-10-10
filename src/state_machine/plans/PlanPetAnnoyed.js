import { planList } from '../../defaults';

export const planPetAnnoyed = function (self) {
  self.setPlan(planList.petAnnoyed);
  self.states.statePetAnnoyed(self);
};
