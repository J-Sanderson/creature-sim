import Goal from './Goal';
import Creature from '../../entities/Creature';
import { adjectiveList, motiveList } from '../../defaults';

export default class GoalSleep extends Goal {
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
    const nearbyBeds = self.queries.getItemsByAdjective(
      self,
      adjectiveList.restful
    );

    let priority = 6;

    if (
      plan === Creature.planList.sleep ||
      motives[motiveList.energy] <= maxMotive / 10
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
      Creature.personalityValues.liveliness,
      false
    );
    priority -= livelinessModifier;

    priority = Math.max(1, priority);

    return priority;
  }
  execute(self) {
    if (self.getMotive(motiveList.energy) >= self.getMaxMotive()) {
      self.goalManager.deleteGoal(Creature.goalList.sleep);
    }
    let goals = self.getGoals();
    if (!goals[Creature.goalList.sleep]) {
      return;
    }

    let target = goals[Creature.goalList.sleep].target;
    if (!target) {
      self.plans.planSeekItem(
        self,
        adjectiveList.restful,
        Creature.motiveIcons.tired,
        Creature.goalList.sleep
      );
    } else {
      if (self.queries.amIOnItem(self, target)) {
        self.plans.planSleep(self);
      } else {
        self.plans.planMoveToItem(self, target, Creature.goalList.sleep);
      }
    }
  }
}
