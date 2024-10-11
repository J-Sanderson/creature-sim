import { planList } from '../../defaults';

export const planAddedItem = function (self) {
  self.setPlan(planList.addedItem);
  self.states.stateAddedItem(self);
};
