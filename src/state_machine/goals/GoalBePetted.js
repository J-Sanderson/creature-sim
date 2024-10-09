import Goal from './Goal';
import Entity from '../../entities/Entity';
import Creature from '../../entities/Creature';

export default class GoalBePetted extends Goal {
  constructor(params) {
    super(params);
    this.type = Goal.types.narrative;
  }
  filter(self, nonReactive = false) {
    if (nonReactive) return -1;

    return 1;
  }
  execute(self) {
    if (
      self.status.state === Creature.stateList.drink ||
      self.status.state === Creature.stateList.eat ||
      self.status.state === Creature.stateList.sleep ||
      self.status.state === Creature.stateList.petAnnoyed
    ) {
      this.decrementTicks();
      if (this.getTicks() <= 0) {
        self.goalManager.deleteGoal(Creature.goalList.pet);
      }
      self.plans.planPetAnnoyed(self);
    } else {
      if (
        self.queries.amIHungry(self) ||
        self.queries.amIThirsty(self) ||
        self.queries.amITired(self)
      ) {
        this.decrementTicks();
        if (this.getTicks() <= 0) {
          self.goalManager.deleteGoal(Creature.goalList.pet);
        }
      }
      self.plans.planPetHappy(self);
    }
  }
}
