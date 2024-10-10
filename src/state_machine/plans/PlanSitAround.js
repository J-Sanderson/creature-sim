import { planList } from '../../defaults';

export const planSitAround = function (self) {
  self.setPlan(planList.sitAround);
  self.states.stateSitAround(self);
};
