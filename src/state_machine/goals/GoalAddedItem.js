import Goal from './Goal';
import worldManager from '../../managers/WorldManager';
import {
  goalTypeList,
  goalList,
  stateList,
  adjectiveList,
} from '../../defaults';

export default class GoalAddedItem extends Goal {
  constructor(params) {
    super(params);
    this.type = goalTypeList.narrative;
  }
  filter(self, nonReactive = false) {
    if (nonReactive) return -1;

    if (
      self.status.state === stateList.drink ||
      self.status.state === stateList.eat ||
      self.status.state === stateList.sleep
    ) {
      return -1;
    }

    return 1;
  }
  execute(self) {
    const world = worldManager.getWorld(self.world);
    const target = world.getItem(this.getTarget());
    if (!target) {
      self.goalManager.deleteGoal(goalList.addedItem);
      return;
    }

    self.plans.planAddedItem(self);

    if (self.queries.amITired(self) || self.queries.amIThirsty(self)) {
      this.decrementTicks();
      if (this.getTicks() <= 0) {
        self.goalManager.deleteGoal(goalList.addedItem);
      }
      return;
    }

    const adjectives = target.getAdjectives();
    const favorites = self.getFavorites();
    if (
      self.queries.amIHungry(self) &&
      adjectives.includes(adjectiveList.tasty)
    ) {
      if (!self.queries.amIFinicky(self)) {
        this.decrementTicks();
        if (this.getTicks() <= 0) {
          self.goalManager.deleteGoal(goalList.addedItem);
        }
        return;
      }
      const flavors = target.getFlavors();
      if (flavors.includes(favorites.flavor)) {
        this.decrementTicks();
        if (this.getTicks() <= 0) {
          self.goalManager.deleteGoal(goalList.addedItem);
        }
        return;
      }
      self.goalManager.deleteGoal(goalList.addedItem);
      self.goalManager.addGoal(self, goalList.snubItem, {
        target: target.getGUID(),
        ticks: 1,
      });
      return;
    }
    // todo see if it's a colour, flavour etc that we like, or fits our interests, or we just randomly feel curious.

    this.decrementTicks();
    if (this.getTicks() <= 0) {
      self.goalManager.deleteGoal(goalList.addedItem);
    }
  }
}
