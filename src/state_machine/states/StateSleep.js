import State from './State';
import { motiveList, stateList, motiveIconList } from '../../defaults';

export default class StateSleep extends State {
  constructor(params) {
    super(params);

    this.name = stateList.sleep;
    this.suppressMotiveDecay.push(motiveList.energy);
  }

  execute(self) {
    const goal = self.goalManager.getGoals()[self.goalManager.getCurrentGoalName()];
    if (!goal) {
      console.error(`Error: no valid goal found for ${this.name}`);
      return;
    }

    const motives = goal.getMotives();
    if (!motives) {
      console.error(`Error: no valid motives found for ${this.name}`);
      return;
    }

    self.showMotive(motiveIconList.sleep);
    for (let motive in motives) {
      if (motives[motive] !== null) {
        self.setMotive(motive, motives[motive]);
      }
    }
  }
}
