import Creature from "../../entities/Creature";
import Entity from "../../entities/Entity";
import worldManager from "../../world/WorldManager";

export default {
    stateMoveRandomly: function (self, pos) {
      self.setState(Creature.stateList.wander);
      self.showMotive("");
      self.setXPosition(pos.x);
      self.setYPosition(pos.y);
  
      const world = worldManager.getWorld(self.world);
      world.moveEntity(self.outputs.icon, self.getPosition());
    },
    stateSeekItem: function (self, motive) {
      self.setState(Creature.stateList.seekItem);
      if (motive) {
        self.showMotive(motive);
      }
    },
    stateMoveToPosition(self, newPos) {
      self.setState(Creature.stateList.moveToPosition);
      self.showMotive(Creature.motiveIcons.movingToTarget);
  
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
        self.getGoals()[Creature.goalList.drink].target
      );
      if (item) {
        const amount = item.getMotive(Entity.motiveList.amount);
        if (amount > 0) {
          self.setState(Creature.stateList.drink);
          self.showMotive(Creature.motiveIcons.drink);
          const transfer = 20;
          let newVal = (hydration += transfer);
          if (newVal > maxVal) {
            newVal = maxVal;
          }
          self.setMotive(Entity.motiveList.hydration, newVal);
          item.setMotive(Entity.motiveList.amount, amount - transfer);
        } else {
          const world = worldManager.getWorld(self.world);
          world.deleteEntity(item.getGUID());
          self.goalManager.deleteGoal(Creature.goalList.drink);
        }
      } else {
        self.goalManager.deleteGoal(Creature.goalList.drink);
      }
    },
    stateEat(self, motives, maxVal) {
      const item = self.queries.getItemFromWorld(
        self,
        self.getGoals()[Creature.goalList.eat].target
      );
  
      if (item) {
        const amount = item.getMotive(Entity.motiveList.amount);
        if (amount > 0) {
          self.setState(Creature.stateList.eat);
          self.showMotive(Creature.motiveIcons.eat);
          const transfer = 10;
          let newVal = (motives[Entity.motiveList.fullness] += transfer);
          if (newVal > maxVal) {
            newVal = maxVal;
          }
          self.setMotive(Entity.motiveList.fullness, newVal);
          item.setMotive(Entity.motiveList.amount, amount - transfer);
          if (motives[Entity.motiveList.hydration] > 0) {
            self.setMotive(
              Entity.motiveList.hydration,
              motives[Entity.motiveList.hydration] - 1
            );
          }
        } else {
          const world = worldManager.getWorld(self.world);
          world.deleteEntity(item.getGUID());
          self.goalManager.deleteGoal(Creature.goalList.eat);
        }
      } else {
        self.goalManager.deleteGoal(Creature.goalList.eat);
      }
    },
    stateSleep(self, energy, maxVal) {
      self.setState(Creature.stateList.sleep);
      self.showMotive(Creature.motiveIcons.sleep);
      let newVal = (energy += 1);
      if (newVal > maxVal) {
        newVal = maxVal;
      }
      self.setMotive(Entity.motiveList.energy, newVal);
    },
    statePetHappy(self) {
      self.setState(Creature.stateList.petHappy);
      self.showMotive(Creature.motiveIcons.petHappy);
    },
    statePetAnnoyed(self) {
      self.setState(Creature.stateList.petAnnoyed);
      self.showMotive(Creature.motiveIcons.petAnnoyed);
    },
    stateSitAround(self) {
      self.setState(Creature.stateList.sitAround);
      self.showMotive(Creature.motiveIcons.sitAround);
    },
    stateMoveToToybox(self) {
      self.setState(Creature.stateList.moveToToybox);
      self.showMotive(Creature.motiveIcons.movingToTarget);
      const pos = self.getPosition();
      self.setYPosition(pos.y + 1);
      const world = worldManager.getWorld(self.world);
      world.moveEntity(self.outputs.icon, self.getPosition());
    },
    statePushItemFromToybox(self) {
      self.setState(Creature.stateList.pushItemFromToybox);
      self.showMotive(Creature.motiveIcons.pushItemFromToybox);
    },
    stateChewToy(self) {
      self.setState(Creature.stateList.chewToy);
      self.showMotive(Creature.motiveIcons.chewToy);
    },
    stateBounceToy(self) {
      self.setState(Creature.stateList.bounceToy);
      self.showMotive(Creature.motiveIcons.bounceToy);
    },
    stateCuddleToy(self) {
      self.setState(Creature.stateList.cuddleToy);
      self.showMotive(Creature.motiveIcons.cuddleToy);
    },
  };