import { utilities } from '../../utils/Utilities';

export class GoalManager {
  constructor() {
    this.goalList = {};
    this.currentGoal = '';
  }

  update(self) {
    this.updateGoalPriorities(self);
    let current = this.goalList[this.currentGoal];
    if (!current || current.getIsSuspended()) {
      // do I have other goals?
      if (Object.keys(this.goalList).length) {
        // is there another valid unsuspended goal in the list?
        let newGoal = this.getTopPriorityGoal(true);
        if (!newGoal) {
          // is there a valid suspended goal in the list?
          newGoal = this.getTopPriorityGoal();
        }
        // unsuspend if needed
        if (this.goalList[newGoal].getIsSuspended()) {
          this.unsuspendGoal(newGoal);
        }
        this.currentGoal = newGoal;
      } else {
        // no goals left, find something interesting to do
        this.findInterestingGoals(self);
      }
    }
    this.goalList[this.currentGoal].execute(self);
  }

  updateGoalPriorities(self) {
    for (let goal in this.goalList) {
      if (goal) {
        const priority = this.goalList[goal].filter(self);
        if (priority < 0) {
          delete this.goalList[goal];
        } else {
          this.goalList[goal].setPriority(priority);
        }
      }
    }
  }

  getTopPriorityGoal(excludeSuspended = false) {
    let highestPriority = Infinity;
    let highestPriorityGoal = null;

    for (let goal in this.goalList) {
      if (this.goalList.hasOwnProperty(goal)) {
        if (
          !excludeSuspended ||
          (excludeSuspended && !this.goalList[goal].getIsSuspended())
        ) {
          const priority = this.goalList[goal].getPriority();
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

  addGoal(self, name, params, isCurrent = true) {
    if (!self.goals.hasOwnProperty(name)) {
      console.error(`Error: no goal object found for ${name}`);
    }
    if (this.goalList.hasOwnProperty(name)) {
      return;
    }
    if (isCurrent) {
      this.currentGoal = name;
    }
    this.goalList[name] = new self.goals[name](params);
  }

  suspendGoal(goalName) {
    let toSuspend = this.goalList[goalName];
    if (toSuspend) {
      toSuspend.suspend();
    }
  }

  unsuspendGoal(goalName) {
    let toUnsuspend = this.goalList[goalName];
    if (toUnsuspend) {
      toUnsuspend.unsuspend();
    }
  }

  deleteGoal(goalName) {
    delete this.goalList[goalName];
  }

  getGoalList() {
    return this.goalList;
  }

  getCurrentGoal() {
    return this.currentGoal;
  }
}
