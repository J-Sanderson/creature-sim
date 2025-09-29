import State from './State';
import worldManager from '../../managers/WorldManager';
import {
  motiveList,
  goalList,
  stateList,
  motiveIconList,
} from '../../defaults';

export default class StateDrink extends State {
  constructor(params) {
    super(params);

    this.name = stateList.drink;
    this.suppressMotiveDecay.push(motiveList.drink);
  }

  execute(self) {
    const item = self.queries.getItemFromWorld(
      self,
      self.getGoals()[goalList.drink].getTarget()
    );
    if (item) {
      const amount = item.getMotive(motiveList.amount);
      if (amount > 0) {
        const goal =
          self.goalManager.getGoals()[self.goalManager.getCurrentGoalName()];
        if (!goal) {
          console.error(`Error: no valid goal found for ${this.name}`);
          return;
        }

        const motives = goal.getMotives();
        if (!motives) {
          console.error(`Error: no valid motives found for ${this.name}`);
          return;
        }

        self.showMotive(motiveIconList.drink);
        for (let motive in motives) {
          if (motives[motive] !== null) {
            self.setMotive(motive, motives[motive]);
          }
        }

        const transfer = 20;
        item.setMotive(motiveList.amount, amount - transfer);
      } else {
        const world = worldManager.getWorld(self.world);
        world.deleteEntity(item.getGUID());
        self.goalManager.deleteGoal(goalList.drink);
      }
    } else {
      self.goalManager.deleteGoal(goalList.drink);
    }
  }
}
