import { motiveList, goalList, planList } from '../../defaults';

export const planEat = function (self) {
  const motives = self.getMotives();
  if (!motives.hasOwnProperty(motiveList.fullness)) {
    console.error(`Error: no ${motiveList.fullness} motive found`);
    return;
  }
  self.setPlan(planList.eat);
  if (motives[motiveList.hydration] < 10) {
    self.goalManager.addGoal(self, goalList.drink, {
      priority: 1,
      suspended: false,
      tickModifiers: {
        personality: self.getPersonalityValues(),
        maxMotive: self.getMaxMotive(),
      },
    });
    self.goalManager.suspendGoal(goalList.eat);
  }
  const maxVal = self.getMaxMotive();
  if (motives[motiveList.fullness] >= maxVal) {
    return;
  }
  self.states.stateEat(self, motives, maxVal);
};
