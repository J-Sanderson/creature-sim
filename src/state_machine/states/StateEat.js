import State from './State';
import worldManager from '../../managers/WorldManager';
import {
  motiveList,
  goalList,
  stateList,
  motiveIconList,
} from '../../defaults';

export default class StateEat extends State {
  constructor(params) {
    super(params);

    this.name = stateList.eat;
    this.suppressMotiveDecay.push(motiveList.fullness);
  }

  execute(self) {
    const item = self.queries.getItemFromWorld(
      self,
      self.getGoals()[goalList.eat].getTarget()
    );

    if (item) {
      const amount = item.getMotive(motiveList.amount);
      if (amount > 0) {
        const goal = self.goalManager.getCurrentGoal();
        if (!goal) {
          console.error(`Error: no valid goal found for ${this.name}`);
          return;
        }

        const motives = goal.getMotives();
        if (!motives) {
          console.error(`Error: no valid motives found for ${this.name}`);
          return;
        }

        self.showMotive(motiveIconList.eat);
        for (let motive in motives) {
          if (motives[motive] !== null) {
            self.setMotive(motive, motives[motive]);
          }
        }

        const transfer = 10;
        item.setMotive(motiveList.amount, amount - transfer);

        const emotions = goal.getEmotions();
        if (emotions) {
          for (let emotion in emotions) {
            if (emotions[emotion] !== null) {
              self.emotionManager.setEmotion(self, emotion, emotions[emotion]);
            }
          }
        }
      } else {
        const world = worldManager.getWorld(self.world);
        world.deleteEntity(item.getGUID());
        self.goalManager.deleteGoal(goalList.eat);
      }
    } else {
      self.goalManager.deleteGoal(goalList.eat);
    }
  }
}
