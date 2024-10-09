import Goal from './Goal';
import Entity from '../../entities/Entity';
import Creature from '../../entities/Creature';

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
      Entity.adjectiveList.restful
    );

    let priority = 6;

    if (
      plan === Creature.planList.sleep ||
      motives[Entity.motiveList.energy] <= maxMotive / 10
    ) {
      priority = 1;
    }

    if (nearbyBeds.length) {
      if (motives[Entity.motiveList.energy] <= maxMotive / 2) {
        priority = 4;
      } else if (motives[Entity.motiveList.energy] <= maxMotive / 1.53) {
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
    if (self.getMotive(Entity.motiveList.energy) >= self.getMaxMotive()) {
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
        Entity.adjectiveList.restful,
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
