import Goal from './Goal';
import {
  adjectiveList,
  motiveList,
  personalityValueList,
  goalList,
  planList,
  motiveIconList,
} from '../../defaults';

export default class GoalEat extends Goal {
  constructor(params) {
    super(params);
    this.type = Goal.types.motive;
  }
  filter(self, nonReactive = false) {
    if (nonReactive) return -1;

    const motives = self.getMotives();
    const maxMotive = self.getMaxMotive();
    const plan = self.getPlan();
    const nearbyFood = self.queries.getItemsByAdjective(
      self,
      adjectiveList.tasty
    );

    let priority = 6;

    if (
      plan === planList.eat ||
      motives[motiveList.fullness] <= maxMotive / 10
    ) {
      priority = 1;
    }

    if (nearbyFood.length) {
      if (motives[motiveList.fullness] <= maxMotive / 2) {
        priority = 4;
      } else if (motives[motiveList.fullness] <= maxMotive / 1.53) {
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
      personalityValueList.metabolism,
      true
    );
    priority -= metabolismModifier;

    priority = Math.max(1, priority);

    return priority;
  }
  execute(self) {
    if (self.getMotive(motiveList.fullness) >= self.getMaxMotive()) {
      self.goalManager.deleteGoal(goalList.eat);
    }
    let goals = self.getGoals();
    if (!goals[goalList.eat]) {
      return;
    }

    let target = goals[goalList.eat].target;
    if (!target) {
      self.plans.planSeekItem(
        self,
        adjectiveList.tasty,
        motiveIconList.hunger,
        goalList.eat
      );
    } else {
      if (self.queries.amIOnItem(self, target)) {
        self.plans.planEat(self);
      } else {
        self.plans.planMoveToItem(self, target, goalList.eat);
      }
    }
  }
}
