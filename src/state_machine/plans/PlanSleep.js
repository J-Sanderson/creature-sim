import { motiveList, goalList, planList } from '../../defaults';

export const planSleep = function (self) {
  const motives = self.getMotives();
  const maxMotive = self.getMaxMotive();
  const motiveModifier = 0.1;
  if (!motives.hasOwnProperty(motiveList.energy)) {
    console.error(`Error: no ${motiveList.energy} motive found`);
    return;
  }
  self.setPlan(planList.sleep);
  if (motives[motiveList.hydration] < maxMotive * motiveModifier) {
    self.goalManager.addGoal(self, goalList.drink, {
      priority: 1,
      suspended: false,
      tickModifiers: {
        personality: self.getPersonalityValues(),
        maxMotive: self.getMaxMotive(),
      },
    });
    self.goalManager.suspendGoal(goalList.sleep);
  }
  if (motives[motiveList.fullness] < maxMotive * motiveModifier) {
    self.goalManager.addGoal(self, goalList.eat, {
      priority: 1,
      suspended: false,
      tickModifiers: {
        personality: self.getPersonalityValues(),
        maxMotive: self.getMaxMotive(),
      },
    });
    self.goalManager.suspendGoal(goalList.sleep);
  }
  const maxVal = self.getMaxMotive();
  if (motives[motiveList.energy] >= maxVal) {
    return;
  }
  self.states.stateSleep(self, motives[motiveList.energy], maxVal);
};
