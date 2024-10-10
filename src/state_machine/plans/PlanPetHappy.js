import { planList } from '../../defaults';

export const planPetHappy = function (self) {
  self.setPlan(planList.petHappy);
  self.states.statePetHappy(self);
};
