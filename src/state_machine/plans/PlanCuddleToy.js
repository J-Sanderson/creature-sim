import { planList } from '../../defaults';

export const planCuddleToy = function (self) {
  self.setPlan(planList.cuddleToy);
  self.states.stateCuddleToy(self);
};
