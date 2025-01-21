import { planList, stateList } from '../../defaults';

export const planSitAround = function (self) {
  self.setPlan(planList.sitAround);
  self.setState(stateList.sitAround);
  self.status.state.execute(self);
};
