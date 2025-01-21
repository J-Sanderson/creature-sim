import { planList, stateList } from '../../defaults';

export const planMissingItem = function (self) {
  self.setPlan(planList.missingItem);
  self.setState(stateList.missingItem);
  self.status.state.execute(self);
};
