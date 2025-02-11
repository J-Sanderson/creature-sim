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
      (plan && plan.name === planList.sleep) ||
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
    const goals = self.getGoals();
    if (!goals[goalList.sleep]) {
      return;
    }

    const energy = self.getMotive(motiveList.energy);
    const plan = self.getPlan();
    if (plan && plan.name === planList.passOut) {
      plan.execute(self);
      return;
    }

    const target = goals[goalList.sleep].getTarget();
    if (!target) {
      if (energy === 0) {
        self.setPlan(planList.passOut);
        self.getPlan().execute(self);
        return;
      }

      self.setPlan(planList.seekItem);
      self
        .getPlan()
        .execute(
          self,
          adjectiveList.restful,
          motiveIconList.tired,
          goalList.sleep
        );
    } else {
      if (self.queries.amIOnItem(self, target)) {
        self.setPlan(planList.sleep);
        self.getPlan().execute(self);
      } else {
        self.setPlan(planList.moveToItem);
        self.getPlan().execute(self, target, goalList.sleep);
      }
    }
  }
}
