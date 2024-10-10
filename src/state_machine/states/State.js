import worldManager from '../../managers/WorldManager';
import {
  motiveList,
  goalList,
  stateList,
  motiveIconList,
} from '../../defaults';

export default {
  stateMoveRandomly: function (self, pos) {
    self.setState(stateList.wander);
    self.showMotive('');
    self.setXPosition(pos.x);
    self.setYPosition(pos.y);

    const world = worldManager.getWorld(self.world);
    world.moveEntity(self.outputs.icon, self.getPosition());
  },
  stateSeekItem: function (self, motive) {
    self.setState(stateList.seekItem);
    if (motive) {
      self.showMotive(motive);
    }
  },
  stateMoveToPosition(self, newPos) {
    self.setState(stateList.moveToPosition);
    self.showMotive(motiveIconList.movingToTarget);

    // move toward the item
    const position = self.getPosition();
    if (newPos.x > position.x) {
      self.setXPosition(position.x + 1);
    }
    if (newPos.x < position.x) {
      self.setXPosition(position.x - 1);
    }
    if (newPos.y > position.y) {
      self.setYPosition(position.y + 1);
    }
    if (newPos.y < position.y) {
      self.setYPosition(position.y - 1);
    }
    const world = worldManager.getWorld(self.world);
    world.moveEntity(self.outputs.icon, self.getPosition());
  },
  stateDrink(self, hydration, maxVal) {
    const item = self.queries.getItemFromWorld(
      self,
      self.getGoals()[goalList.drink].target
    );
    if (item) {
      const amount = item.getMotive(motiveList.amount);
      if (amount > 0) {
        self.setState(stateList.drink);
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
  },
  stateEat(self, motives, maxVal) {
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
          self.setMotive(
            motiveList.hydration,
            motives[motiveList.hydration] - 1
          );
        }
      } else {
        const world = worldManager.getWorld(self.world);
        world.deleteEntity(item.getGUID());
        self.goalManager.deleteGoal(goalList.eat);
      }
    } else {
      self.goalManager.deleteGoal(goalList.eat);
    }
  },
  stateSleep(self, energy, maxVal) {
    self.setState(stateList.sleep);
    self.showMotive(motiveIconList.sleep);
    let newVal = (energy += 1);
    if (newVal > maxVal) {
      newVal = maxVal;
    }
    self.setMotive(motiveList.energy, newVal);
  },
  statePetHappy(self) {
    self.setState(stateList.petHappy);
    self.showMotive(motiveIconList.petHappy);
  },
  statePetAnnoyed(self) {
    self.setState(stateList.petAnnoyed);
    self.showMotive(motiveIconList.petAnnoyed);
  },
  stateSitAround(self) {
    self.setState(stateList.sitAround);
    self.showMotive(motiveIconList.sitAround);
  },
  stateMoveToToybox(self) {
    self.setState(stateList.moveToToybox);
    self.showMotive(motiveIconList.movingToTarget);
    const pos = self.getPosition();
    self.setYPosition(pos.y + 1);
    const world = worldManager.getWorld(self.world);
    world.moveEntity(self.outputs.icon, self.getPosition());
  },
  statePushItemFromToybox(self) {
    self.setState(stateList.pushItemFromToybox);
    self.showMotive(motiveIconList.pushItemFromToybox);
  },
  stateChewToy(self) {
    self.setState(stateList.chewToy);
    self.showMotive(motiveIconList.chewToy);
  },
  stateBounceToy(self) {
    self.setState(stateList.bounceToy);
    self.showMotive(motiveIconList.bounceToy);
  },
  stateCuddleToy(self) {
    self.setState(stateList.cuddleToy);
    self.showMotive(motiveIconList.cuddleToy);
  },
};
