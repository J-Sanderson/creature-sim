import { planList, stateList } from '../../defaults';

export const planSnubItem = function (self) {
  self.setPlan(planList.snubItem);
  self.setState(stateList.snubItem);
  self.status.state.execute(self);
};
