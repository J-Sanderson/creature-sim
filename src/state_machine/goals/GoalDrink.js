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

export default class GoalDrink extends Goal {
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
    const nearbyWater = self.queries.getItemsByAdjective(
      self,
      adjectiveList.wet
    );

    let priority = 6;

    if (
      plan === planList.drink ||
      motives[motiveList.hydration] <= maxMotive * motiveModifier
    ) {
      priority = 1;
    }

    if (nearbyWater.length) {
      if (motives[motiveList.hydration] <= maxMotive / 2) {
        priority = 4;
      } else if (motives[motiveList.hydration] <= maxMotive / 1.53) {
        priority = 5;
      }
    }

    const livelinessModifier = this.calculatePersonalityModifier(
      self,
      personalityValueList.liveliness,
      true
    );
    priority -= livelinessModifier;

    priority = Math.max(1, priority);

    return priority;
  }
  execute(self) {
    if (self.getMotive(motiveList.hydration) >= self.getMaxMotive()) {
      self.goalManager.deleteGoal(goalList.drink);
    }
    let goals = self.getGoals();
    if (!goals[goalList.drink]) {
      return;
    }

    let target = goals[goalList.drink].target;
    if (!target) {
      self.plans.planSeekItem(
        self,
        adjectiveList.wet,
        motiveIconList.thirst,
        goalList.drink
      );
    } else {
      if (self.queries.amIOnItem(self, target)) {
        self.plans.planDrink(self);
      } else {
        self.plans.planMoveToItem(self, target, goalList.drink);
      }
    }
  }
}
