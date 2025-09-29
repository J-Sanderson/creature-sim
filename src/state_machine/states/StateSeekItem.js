import State from './State';
import worldManager from '../../managers/WorldManager';
import { stateList, emotionList } from '../../defaults';

export default class StateSeekItem extends State {
  constructor(params) {
    super(params);

    this.name = stateList.seekItem;
    this.suppressEmotionDecay.push(emotionList.sad);
    this.suppressEmotionDecay.push(emotionList.angry);
  }

  execute(self) {
    const goal = self.goalManager.getGoals()[self.goalManager.getCurrentGoalName()];
    if (!goal) {
      console.error(`Error: no valid goal found for ${this.name}`);
      return;
    }

    const emotions = goal.getEmotions();
    if (!emotions) {
      console.error(`Error: no valid emotions found for ${this.name}`);
      return;
    }

    const pos = goal.getDirection();
    if (!pos) {
      console.error(`Error: no valid position found for ${this.name}`);
      return;
    }

    const motiveIcon = goal.getMotiveIcon();
    self.showMotive(motiveIcon ? motiveIcon : '');

    for (let emotion in emotions) {
      if (emotions[emotion] !== null) {
        self.emotionManager.setEmotion(self, emotion, emotions[emotion]);
      }
    }

    self.setXPosition(pos.x);
    self.setYPosition(pos.y);
    const world = worldManager.getWorld(self.world);
    world.moveEntity(self.outputs.icon, self.getPosition());
  }
}
