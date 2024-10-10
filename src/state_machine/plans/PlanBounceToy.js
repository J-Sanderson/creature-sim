import { planList } from '../../defaults';

export const planBounceToy = function (self) {
  self.setPlan(planList.bounceToy);
  self.states.stateBounceToy(self);
};
