import { planList, stateList } from '../../defaults';

export const planMoveToToybox = function (self) {
  self.setPlan(planList.moveToToybox);
  self.setState(stateList.moveToToybox);
  self.status.state.execute(self);
};
