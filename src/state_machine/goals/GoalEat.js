import Goal from './Goal';
import {
  adjectiveList,
  motiveList,
  personalityValueList,
  goalList,
  planList,
  motiveIconList,
  goalTypeList,
} from '../../defaults';

export default class GoalEat extends Goal {
  constructor(params) {
    super(params);
    this.type = goalTypeList.motive;
  }
  filter(self, nonReactive = false) {
    if (nonReactive) return -1;

    const motives = self.getMotives();
    const maxMotive = self.getMaxMotive();
    const motiveModifier = 0.1;
    const plan = self.getPlan();
    const nearbyFood = self.queries.getItemsByAdjective(
      self,
      adjectiveList.tasty
    );

    let priority = 6;

    if (
      (plan && plan.name === planList.eat) ||
      motives[motiveList.fullness] <= maxMotive * motiveModifier
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

    let target = goals[goalList.eat].getTarget();
    if (!target) {
      self.setPlan(planList.seekItem);
      self
        .getPlan()
        .execute(
          self,
          adjectiveList.tasty,
          motiveIconList.hunger,
          goalList.eat
        );
    } else {
      if (self.queries.amIOnItem(self, target)) {
        self.setPlan(planList.eat);
        self.getPlan().execute(self);
      } else {
        self.setPlan(planList.moveToItem);
        self.getPlan().execute(self, target, goalList.eat);
      }
    }
  }
}
