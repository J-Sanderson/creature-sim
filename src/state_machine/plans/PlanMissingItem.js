import { planList } from '../../defaults';

export const planMissingItem = function (self) {
  self.setPlan(planList.missingItem);
  self.states.stateMissingItem(self);
};
