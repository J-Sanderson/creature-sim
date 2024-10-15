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

export default class GoalSleep extends Goal {
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
    const nearbyBeds = self.queries.getItemsByAdjective(
      self,
      adjectiveList.restful
    );

    let priority = 6;

    if (
      plan === planList.sleep ||
      motives[motiveList.energy] <= maxMotive * motiveModifier
    ) {
      priority = 1;
    }

    if (nearbyBeds.length) {
      if (motives[motiveList.energy] <= maxMotive / 2) {
        priority = 4;
      } else if (motives[motiveList.energy] <= maxMotive / 1.53) {
        priority = 5;
      }
    }

    const livelinessModifier = this.calculatePersonalityModifier(
      self,
      personalityValueList.liveliness,
      false
    );
    priority -= livelinessModifier;

    priority = Math.max(1, priority);

    return priority;
  }
  execute(self) {
    if (self.getMotive(motiveList.energy) >= self.getMaxMotive()) {
      self.goalManager.deleteGoal(goalList.sleep);
    }
    let goals = self.getGoals();
    if (!goals[goalList.sleep]) {
      return;
    }

    let target = goals[goalList.sleep].target;
    if (!target) {
      self.plans.planSeekItem(
        self,
        adjectiveList.restful,
        motiveIconList.tired,
        goalList.sleep
      );
    } else {
      if (self.queries.amIOnItem(self, target)) {
        self.plans.planSleep(self);
      } else {
        self.plans.planMoveToItem(self, target, goalList.sleep);
      }
    }
  }
}
