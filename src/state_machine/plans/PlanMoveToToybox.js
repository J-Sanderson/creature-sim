import { planList } from '../../defaults';

export const planMoveToToybox = function (self) {
  self.setPlan(planList.moveToToybox);
  self.states.stateMoveToToybox(self);
};
