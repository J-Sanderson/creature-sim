import { motiveList, planList } from '../../defaults';

export const planDrink = function (self) {
  self.setPlan(planList.drink);
  const hydration = self.getMotive(motiveList.hydration);
  const maxVal = self.getMaxMotive();
  if (hydration >= maxVal) {
    return;
  }
  self.states.stateDrink(self, hydration, maxVal);
};
