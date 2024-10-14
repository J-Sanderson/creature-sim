import { planList, stateList } from '../../defaults';

export const planSnubItem = function (self) {
  self.setPlan(planList.snubItem);
  self.states[stateList.snubItem](self);
};
