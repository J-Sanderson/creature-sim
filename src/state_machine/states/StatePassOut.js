import State from './State';
import {
  stateList,
  motiveList,
  motiveIconList,
  emotionList,
} from '../../defaults';

export default class StatePassOut extends State {
  constructor(params) {
    super(params);

    this.name = stateList.passOut;
    this.suppressMotiveDecay.push(motiveList.energy);
    this.suppressEmotionDecay.push(emotionList.sad);
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

    const emotions = goal.getEmotions();
    if (!emotions) {
      console.error(`Error: no valid emotions found for ${this.name}`);
      return;
    }

    self.showMotive(motiveIconList.passOut);
    for (let motive in motives) {
      if (motives[motive] !== null) {
        self.setMotive(motive, motives[motive]);
      }
    }

    for (let emotion in emotions) {
      if (emotions[emotion] !== null) {
        self.emotionManager.setEmotion(self, emotion, emotions[emotion]);
      }
    }
  }
}
