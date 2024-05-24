class GoalDrink extends Goal {
  constructor (params) {
    super(params);
  }
  filter(self) {
    // creature is thirsty or running the drink plan
    if (
      self.getPriority() === "hydration" ||
      self.status.plan === Creature.planList.drink
    ) {
      return 1;
    }
    return 3;
  }
  execute(self) {
    if (self.getMotive("hydration") >= self.getMaxMotive()) {
      self.deleteGoal(Creature.goalList.drink);
    }
    let goals = self.getGoals();
    const drinkGoal = goals.get(Creature.goalList.drink);
    if (!drinkGoal) {
      return;
    }

      let target = drinkGoal.getTarget();
      console.log('Target after first round:', JSON.stringify(target));
    if (!target) {
      console.log('no target found')
      self.plans.planSeekItem(
        self,
        Entity.adjectiveList.wet,
        Creature.motiveIcons.thirst,
        Creature.goalList.drink
      );
      target = drinkGoal.getTarget();
      console.log('Target after seeking item:', JSON.stringify(target));
    } else {
      console.log('target found')
      if (self.queries.amIOnItem(self, target)) {
        self.plans.planDrink(self);
      } else {
        self.plans.planMoveToItem(self, target, Creature.goalList.drink);
      }
    }
  }
}
