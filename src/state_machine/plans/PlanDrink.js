import { motiveList, planList, stateList } from '../../defaults';

export const planDrink = function (self) {
  self.setPlan(planList.drink);
  const hydration = self.getMotive(motiveList.hydration);
  const maxVal = self.getMaxMotive();
  if (hydration >= maxVal) {
    return;
  }

  self.setState(stateList.drink);
  self.status.state.execute(self, hydration, maxVal);
};
