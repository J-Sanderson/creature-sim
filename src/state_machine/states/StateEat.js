import worldManager from '../../managers/WorldManager';
import {
  motiveList,
  goalList,
  stateList,
  motiveIconList,
} from '../../defaults';

export const stateEat = function (self, motives, maxVal) {
  const item = self.queries.getItemFromWorld(
    self,
    self.getGoals()[goalList.eat].target
  );

  if (item) {
    const amount = item.getMotive(motiveList.amount);
    if (amount > 0) {
      self.setState(stateList.eat);
      self.showMotive(motiveIconList.eat);
      const transfer = 10;
      let newVal = (motives[motiveList.fullness] += transfer);
      if (newVal > maxVal) {
        newVal = maxVal;
      }
      self.setMotive(motiveList.fullness, newVal);
      item.setMotive(motiveList.amount, amount - transfer);
      if (motives[motiveList.hydration] > 0) {
        self.setMotive(motiveList.hydration, motives[motiveList.hydration] - 1);
      }
    } else {
      const world = worldManager.getWorld(self.world);
      world.deleteEntity(item.getGUID());
      self.goalManager.deleteGoal(goalList.eat);
    }
  } else {
    self.goalManager.deleteGoal(goalList.eat);
  }
};
