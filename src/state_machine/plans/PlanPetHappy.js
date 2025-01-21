import { planList, stateList } from '../../defaults';

export const planPetHappy = function (self) {
  self.setPlan(planList.petHappy);
  self.setState(stateList.petHappy);
  self.status.state.execute(self);
};
