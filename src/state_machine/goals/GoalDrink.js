import Goal from './Goal';
import Creature from '../../entities/Creature';
import { adjectiveList, motiveList } from '../../defaults';

export default class GoalDrink extends Goal {
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
    const nearbyWater = self.queries.getItemsByAdjective(
      self,
      adjectiveList.wet
    );

    let priority = 6;

    if (
      plan === Creature.planList.drink ||
      motives[motiveList.hydration] <= maxMotive / 10
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
      Creature.personalityValues.liveliness,
      true
    );
    priority -= livelinessModifier;

    priority = Math.max(1, priority);

    return priority;
  }
  execute(self) {
    if (self.getMotive(motiveList.hydration) >= self.getMaxMotive()) {
      self.goalManager.deleteGoal(Creature.goalList.drink);
    }
    let goals = self.getGoals();
    if (!goals[Creature.goalList.drink]) {
      return;
    }

    let target = goals[Creature.goalList.drink].target;
    if (!target) {
      self.plans.planSeekItem(
        self,
        adjectiveList.wet,
        Creature.motiveIcons.thirst,
        Creature.goalList.drink
      );
    } else {
      if (self.queries.amIOnItem(self, target)) {
        self.plans.planDrink(self);
      } else {
        self.plans.planMoveToItem(self, target, Creature.goalList.drink);
      }
    }
  }
}
