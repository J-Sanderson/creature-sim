import State from './State';
import worldManager from '../../managers/WorldManager';
import {
  motiveList,
  goalList,
  stateList,
  emotionList,
  motiveIconList,
} from '../../defaults';

export default class StateEat extends State {
  constructor(params) {
    super(params);

    this.name = stateList.eat;
    this.suppressMotiveDecay.push(motiveList.fullness);
  }

  execute(self, motives, maxVal) {
    const item = self.queries.getItemFromWorld(
      self,
      self.getGoals()[goalList.eat].target
    );

    if (item) {
      const amount = item.getMotive(motiveList.amount);
      if (amount > 0) {
        self.showMotive(motiveIconList.eat);
        const transfer = 10;
        let newVal = (motives[motiveList.fullness] += transfer);
        if (newVal > maxVal) {
          newVal = maxVal;
        }
        self.setMotive(motiveList.fullness, newVal);
        item.setMotive(motiveList.amount, amount - transfer);
        if (motives[motiveList.hydration] > 0) {
          self.setMotive(
            motiveList.hydration,
            motives[motiveList.hydration] - 1
          );
        }
        if (item.getFlavors().includes(self.getFavorites().flavor)) {
          const emotions = self.getEmotions();
          let happiness = emotions[emotionList.happy];
          this.suppressEmotionDecay.push(emotionList.happy);
          if (happiness < maxVal) {
            self.emotionManager.setEmotion(self, emotionList.happy, happiness + 1);
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
