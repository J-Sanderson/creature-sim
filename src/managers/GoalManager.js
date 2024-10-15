import { utilities } from '../utils/Utilities';
import { goalList, adjectiveList } from '../defaults';

export class GoalManager {
  constructor() {
    this.goals = {};
    this.currentGoal = '';
  }

  update(self) {
    this.updateGoalPriorities(self);
    let current = this.goals[this.currentGoal];
    if (!current || current.getIsSuspended()) {
      // do I have other goals?
      if (Object.keys(this.goals).length) {
        // is there another valid unsuspended goal in the list?
        let newGoal = this.getTopPriorityGoal(true);
        if (!newGoal) {
          // is there a valid suspended goal in the list?
          newGoal = this.getTopPriorityGoal();
        }
        // unsuspend if needed
        if (this.goals[newGoal].getIsSuspended()) {
          this.unsuspendGoal(newGoal);
        }
        this.currentGoal = newGoal;
      } else {
        // no goals left, find something interesting to do
        this.findInterestingGoals(self);
      }
    }
    this.goals[this.currentGoal].execute(self);
  }

  updateGoalPriorities(self) {
    for (let goal in this.goals) {
      if (goal) {
        const priority = this.goals[goal].filter(self);
        if (priority < 0) {
          delete this.goals[goal];
        } else {
          this.goals[goal].setPriority(priority);
        }
      }
    }
  }

  getTopPriorityGoal(excludeSuspended = false) {
    let highestPriority = Infinity;
    let highestPriorityGoal = null;

    for (let goal in this.goals) {
      if (this.goals.hasOwnProperty(goal)) {
        if (
          !excludeSuspended ||
          (excludeSuspended && !this.goals[goal].getIsSuspended())
        ) {
          const priority = this.goals[goal].getPriority();
          if (priority < highestPriority) {
            highestPriority = priority;
            highestPriorityGoal = goal;
          }
        }
      }
    }

    return highestPriorityGoal;
  }

  findInterestingGoals(self) {
    let candidateGoals = [];
    for (let goal in self.goals) {
      const tempInstance = new self.goals[goal]();
      const priority = tempInstance.filter(self, true);
      if (priority > -1) {
        candidateGoals.push({ name: goal, priority });
      }
    }
    if (!candidateGoals.length) {
      this.addGoal(self, goalList.wander, {
        ticks: 5,
        tickModifiers: {
          personality: self.getPersonalityValues(),
          maxMotive: self.getMaxMotive(),
        },
      });
    }
    candidateGoals.sort((a, b) => {
      if (a.priority < b.priority) return -1;
      if (a.priority > b.priority) return 1;
      return 0;
    });
    let chosenGoal = '';
    const threshold = 2;
    for (let i = 0; i < candidateGoals.length; i++) {
      if (
        i === candidateGoals.length - 1 ||
        utilities.rand(threshold) !== threshold - 1
      ) {
        chosenGoal = candidateGoals[i].name;
        break;
      }
    }
    this.addGoal(self, chosenGoal, {
      ticks: 5,
      tickModifiers: {
        personality: self.getPersonalityValues(),
        maxMotive: self.getMaxMotive(),
      },
    });
  }

  findGoalForItem(self, target) {
    let candidateGoals = [];
    const adjectives = target.getAdjectives();
    if (adjectives.includes(adjectiveList.chew)) {
      candidateGoals.push({name: goalList.chewToy});
    }
    if (adjectives.includes(adjectiveList.bounce)) {
      candidateGoals.push({name: goalList.bounceToy});
    }
    if (adjectives.includes(adjectiveList.soft)) {
      candidateGoals.push({name: goalList.cuddleToy});
    }
    if (!candidateGoals.length) return;

    candidateGoals.forEach(goal => {
      const tempInstance = new self.goals[goal.name]();
      const priority = tempInstance.filter(self, true);
      goal.priority = priority;
    });
    candidateGoals = candidateGoals.filter(goal => goal.priority > 0);
    candidateGoals.sort((a, b) => {
      if (a.priority < b.priority) return -1;
      if (a.priority > b.priority) return 1;
      return 0;
    });
    let chosenGoal = '';
    const threshold = 2;
    for (let i = 0; i < candidateGoals.length; i++) {
      if (
        i === candidateGoals.length - 1 ||
        utilities.rand(threshold) !== threshold - 1
      ) {
        chosenGoal = candidateGoals[i].name;
        break;
      }
    }
    this.addGoal(self, chosenGoal, {
      ticks: 5,
      tickModifiers: {
        personality: self.getPersonalityValues(),
        maxMotive: self.getMaxMotive(),
      },
      target: target.getGUID(),
    });
  }

  addGoal(self, name, params, isCurrent = true) {
    if (!self.goals.hasOwnProperty(name)) {
      console.error(`Error: no goal object found for ${name}`);
      return;
    }
    if (this.goals.hasOwnProperty(name)) {
      return;
    }
    if (isCurrent) {
      this.currentGoal = name;
    }
    this.goals[name] = new self.goals[name](params);
  }

  suspendGoal(goalName) {
    let toSuspend = this.goals[goalName];
    if (toSuspend) {
      toSuspend.suspend();
    }
  }

  unsuspendGoal(goalName) {
    let toUnsuspend = this.goals[goalName];
    if (toUnsuspend) {
      toUnsuspend.unsuspend();
    }
  }

  deleteGoal(goalName) {
    delete this.goals[goalName];
  }

  getGoals() {
    return this.goals;
  }

  getCurrentGoal() {
    return this.currentGoal;
  }
}
