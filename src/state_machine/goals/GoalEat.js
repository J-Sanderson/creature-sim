import Goal from './Goal';
import Entity from '../../entities/Entity';
import Creature from '../../entities/Creature';

export default class GoalEat extends Goal {
  constructor(params) {
    super(params);
    this.type = Goal.types.motive;
  }
  filter(self, nonReactive = false) {
    if (nonReactive) return -1;

    const motives = self.getMotives();
    const maxMotive = self.getMaxMotive();
    const personalityValues = self.getPersonalityValues();
    const plan = self.getPlan();
    const nearbyFood = self.queries.getItemsByAdjective(
      self,
      Entity.adjectiveList.tasty
    );

    let priority = 6;

    if (
      plan === Creature.planList.eat ||
      motives[Entity.motiveList.fullness] <= maxMotive / 10
    ) {
      priority = 1;
    }

    if (nearbyFood.length) {
      if (motives[Entity.motiveList.fullness] <= maxMotive / 2) {
        priority = 4;
      } else if (motives[Entity.motiveList.fullness] <= maxMotive / 1.53) {
        priority = 5;
      }
      const pref = self.getFavorites().flavor;
      const preferredFood = nearbyFood.filter((item) => {
        return item.getFlavors().includes(pref);
      });
      if (preferredFood.length) {
        priority += 2;
      }
    }

    const metabolismModifier = this.calculatePersonalityModifier(
      self,
      Creature.personalityValues.metabolism,
      true
    );
    priority -= metabolismModifier;

    priority = Math.max(1, priority);

    return priority;
  }
  execute(self) {
    if (self.getMotive(Entity.motiveList.fullness) >= self.getMaxMotive()) {
      self.goalManager.deleteGoal(Creature.goalList.eat);
    }
    let goals = self.getGoals();
    if (!goals[Creature.goalList.eat]) {
      return;
    }

    let target = goals[Creature.goalList.eat].target;
    if (!target) {
      self.plans.planSeekItem(
        self,
        Entity.adjectiveList.tasty,
        Creature.motiveIcons.hunger,
        Creature.goalList.eat
      );
    } else {
      if (self.queries.amIOnItem(self, target)) {
        self.plans.planEat(self);
      } else {
        self.plans.planMoveToItem(self, target, Creature.goalList.eat);
      }
    }
  }
}
