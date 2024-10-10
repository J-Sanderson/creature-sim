import { planList } from '../../defaults';

export const planChewToy = function (self) {
  self.setPlan(planList.chewToy);
  self.states.stateChewToy(self);
};
