import { planList, stateList } from '../../defaults';

export const planAddedItem = function (self) {
  self.setPlan(planList.addedItem);
  self.setState(stateList.addedItem);
  self.status.state.execute(self);
};
