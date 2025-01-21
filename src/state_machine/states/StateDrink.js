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

  execute(self, hydration, maxVal) {
    const item = self.queries.getItemFromWorld(
      self,
      self.getGoals()[goalList.drink].target
    );
    if (item) {
      const amount = item.getMotive(motiveList.amount);
      if (amount > 0) {
        self.showMotive(motiveIconList.drink);
        const transfer = 20;
        let newVal = (hydration += transfer);
        if (newVal > maxVal) {
          newVal = maxVal;
        }
        self.setMotive(motiveList.hydration, newVal);
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
