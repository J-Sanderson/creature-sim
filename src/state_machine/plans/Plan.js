import Entity from '../../entities/Entity';
import Creature from '../../entities/Creature';
import { utilities } from '../../utils/Utilities';

export default {
  planWander: function (self) {
    self.setPlan(Creature.planList.wander);
    const validDirections = self.queries.getValidDirections(self);

    if (validDirections.length > 0) {
      const randomDirection = Math.floor(
        Math.random() * validDirections.length
      );
      const { dx, dy } = validDirections[randomDirection];
      const position = self.getPosition();

      const newX = position.x + dx;
      const newY = position.y + dy;

      self.states.stateMoveRandomly(self, { x: newX, y: newY });
    } else {
      console.error('No valid movement direction available');
    }
  },
  planSeekItem: function (self, adj, motive, goal) {
    self.setPlan(Creature.planList.seekItem);

    let interestingItems = self.queries.getItemsByAdjective(self, adj);
    const position = self.getPosition();

    if (adj === Entity.adjectiveList.tasty && self.queries.amIFinicky(self)) {
      const pref = self.getFavorites().flavor;
      const preferredItems = interestingItems.filter((item) => {
        return item.getFlavors().includes(pref);
      });
      interestingItems = preferredItems;
    }

    if (
      adj === Entity.adjectiveList.bounce ||
      adj === Entity.adjectiveList.chew
    ) {
      const pref = self.getFavorites().color;
      const preferredItems = interestingItems.filter((item) => {
        return item.getColors().includes(pref);
      });
      if (preferredItems.length) {
        interestingItems = preferredItems;
      }
    }

    // get the closest of these
    let minDistance = Infinity;
    let closestItem = null;
    interestingItems.forEach((item) => {
      const itemPos = item.getPosition();
      const distance = Math.sqrt(
        (itemPos.x - itemPos.x) ** 2 + (position.y - position.y) ** 2
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestItem = item;
      }
    });

    if (closestItem) {
      let goals = self.getGoals();
      if (goals.hasOwnProperty(goal)) {
        goals[goal].setTarget(closestItem.guid);
      }
    } else {
      self.goalManager.suspendGoal(goal);
      self.goalManager.addGoal(self, Creature.goalList.knockItemFromToybox, {
        calledBy: goal,
        tickModifiers: {
          personality: self.getPersonalityValues(),
          maxMotive: self.getMaxMotive(),
        },
      });
    }

    const itemPos = closestItem === null ? null : closestItem.getPosition();
    self.states.stateSeekItem(self, motive, itemPos);
  },
  planMoveToItem: function (self, id, goal) {
    const item = self.queries.getItemFromWorld(self, id);
    if (!item) {
      self.goalManager.deleteGoal(goal);
      return;
    }
    const itemPos = item.getPosition();
    self.states.stateMoveToPosition(self, itemPos);
  },
  planDrink: function (self) {
    self.setPlan(Creature.planList.drink);
    const hydration = self.getMotive(Entity.motiveList.hydration);
    const maxVal = self.getMaxMotive();
    if (hydration >= maxVal) {
      return;
    }
    self.states.stateDrink(self, hydration, maxVal);
  },
  planEat: function (self) {
    const motives = self.getMotives();
    if (!motives.hasOwnProperty(Entity.motiveList.fullness)) {
      console.error(`Error: no ${Entity.motiveList.fullness} motive found`);
      return;
    }
    self.setPlan(Creature.planList.eat);
    if (motives[Entity.motiveList.hydration] < 10) {
      self.goalManager.addGoal(self, Creature.goalList.drink, {
        priority: 1,
        suspended: false,
        tickModifiers: {
          personality: self.getPersonalityValues(),
          maxMotive: self.getMaxMotive(),
        },
      });
      self.goalManager.suspendGoal(Creature.goalList.eat);
    }
    const maxVal = self.getMaxMotive();
    if (motives[Entity.motiveList.fullness] >= maxVal) {
      return;
    }
    self.states.stateEat(self, motives, maxVal);
  },
  planSleep: function (self) {
    const motives = self.getMotives();
    if (!motives.hasOwnProperty(Entity.motiveList.energy)) {
      console.error(`Error: no ${Entity.motiveList.energy} motive found`);
      return;
    }
    self.setPlan(Creature.planList.sleep);
    if (motives[Entity.motiveList.hydration] < 10) {
      self.goalManager.addGoal(self, Creature.goalList.drink, {
        priority: 1,
        suspended: false,
        tickModifiers: {
          personality: self.getPersonalityValues(),
          maxMotive: self.getMaxMotive(),
        },
      });
      self.goalManager.suspendGoal(Creature.goalList.sleep);
    }
    if (motives[Entity.motiveList.fullness] < 10) {
      self.goalManager.addGoal(self, Creature.goalList.eat, {
        priority: 1,
        suspended: false,
        tickModifiers: {
          personality: self.getPersonalityValues(),
          maxMotive: self.getMaxMotive(),
        },
      });
      self.goalManager.suspendGoal(Creature.goalList.sleep);
    }
    const maxVal = self.getMaxMotive();
    if (motives[Entity.motiveList.energy] >= maxVal) {
      return;
    }
    self.states.stateSleep(self, motives[Entity.motiveList.energy], maxVal);
  },
  planPetHappy: function (self) {
    self.setPlan(Creature.planList.petHappy);
    self.states.statePetHappy(self);
  },
  planPetAnnoyed: function (self) {
    self.setPlan(Creature.planList.petAnnoyed);
    self.states.statePetAnnoyed(self);
  },
  planSitAround: function (self) {
    self.setPlan(Creature.planList.sitAround);
    self.states.stateSitAround(self);
  },
  planMoveToToybox: function (self) {
    self.setPlan(Creature.planList.moveToToybox);
    self.states.stateMoveToToybox(self);
  },
  planPushItemFromToybox(self) {
    self.setPlan(Creature.planList.pushItemFromToybox);

    let goals = self.getGoals();
    if (!goals[Creature.goalList.knockItemFromToybox]) {
      console.error(
        `Error: no relevant goal found for ${Creature.goalList.knockItemFromToybox}`
      );
    }

    let adj = '';
    let calledBy = goals[Creature.goalList.knockItemFromToybox].getCalledBy();
    switch (calledBy) {
      case 'goalEat':
        adj = Entity.adjectiveList.tasty;
        break;
      case 'goalDrink':
        adj = Entity.adjectiveList.wet;
        break;
      case 'goalSleep':
        adj = Entity.adjectiveList.restful;
        break;
      case 'goalChewToy':
        adj = Entity.adjectiveList.chew;
        break;
      case 'goalBounceToy':
        adj = Entity.adjectiveList.bounce;
        break;
      default:
    }

    let toybox = document.querySelector(`[data-world="${self.world}"]`);
    let buttons = Array.from(toybox.querySelectorAll('button'));
    if (adj) {
      let pref;
      if (adj === Entity.adjectiveList.tasty) {
        pref = self.getFavorites().flavor;
      }
      if (
        adj === Entity.adjectiveList.bounce ||
        adj === Entity.adjectiveList.chew
      ) {
        pref = self.getFavorites().color;
      }
      const nearbyItems = self.queries.getItemsByAdjective(self, adj);
      if (pref) {
        const preferredItems = nearbyItems.filter((item) => {
          const properties =
            adj === Entity.adjectiveList.tasty
              ? item.getFlavors()
              : item.getColors();
          return properties.includes(pref);
        });
        if (preferredItems.length) {
          nearbyItems = preferredItems;
        }
      }
      if (nearbyItems.length) {
        self.goalManager.deleteGoal(Creature.goalList.knockItemFromToybox);
        self.goalManager.unsuspendGoal(calledBy);
      } else {
        let interestingButtons = buttons.filter((button) => {
          return button.dataset.adjectives.split(',').includes(adj);
        });
        if (interestingButtons.length) {
          if (pref && self.queries.amIFinicky(self)) {
            const preferredButtons = interestingButtons.filter((button) => {
              const dataset =
                adj === Entity.adjectiveList.tasty
                  ? button.dataset.flavors
                  : button.dataset.colors;
              return dataset.split(',').includes(pref);
            });
            interestingButtons = preferredButtons;
          }
          self.states.statePushItemFromToybox(self);
          const button =
            interestingButtons[utilities.rand(interestingButtons.length - 1)];
          button.click();
        } else {
          self.goalManager.deleteGoal(Creature.goalList.knockItemFromToybox);
          self.goalManager.unsuspendGoal(calledBy);
        }
      }
    } else {
      let interestingButtons = buttons.filter((button) => {
        return !button.classList.contains('item-active');
      });
      if (interestingButtons.length) {
        self.states.statePushItemFromToybox(self);
        const button =
          interestingButtons[utilities.rand(interestingButtons.length - 1)];
        button.click();
      }
      self.goalManager.deleteGoal(Creature.goalList.knockItemFromToybox);
    }
  },
  planChewToy(self) {
    self.setPlan(Creature.planList.chewToy);
    self.states.stateChewToy(self);
  },
  planBounceToy(self) {
    self.setPlan(Creature.planList.bounceToy);
    self.states.stateBounceToy(self);
  },
  planCuddleToy(self) {
    self.setPlan(Creature.planList.cuddleToy);
    self.states.stateCuddleToy(self);
  },
  planMoveFromItem(self) {
    self.setPlan(Creature.planList.moveFromItem);
    const validDirections = self.queries.getValidDirections(self);

    // todo should try to move to an empty square if possible
    if (validDirections.length > 0) {
      const randomDirection = Math.floor(
        Math.random() * validDirections.length
      );
      const { dx, dy } = validDirections[randomDirection];
      const position = self.getPosition();
      const newX = position.x + dx;
      const newY = position.y + dy;
      self.states.stateMoveToPosition(self, { x: newX, y: newY });
    } else {
      console.error('No valid movement direction available');
    }
  },
};
