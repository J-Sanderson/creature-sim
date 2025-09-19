import Plan from './Plan';
import {
  planList,
  stateList,
  emotionList,
  personalityValueList,
} from '../../defaults';

export default class PlanMissingItem extends Plan {
  constructor(params) {
    super(params);

    this.name = planList.missingItem;
  }

  execute(self) {
    const emotions = self.getEmotions();
    if (!emotions.hasOwnProperty(emotionList.sad)) {
      console.error(`Error: no ${emotionList.sad} motive found`);
      return;
    }

    const goal = self.goalManager.getGoals()[self.goalManager.getCurrentGoal()];
    if (!goal) {
      console.error(`Error: no valid goal found for ${this.name}`);
      return;
    }

    const personalityValues = self.getPersonalityValues();
    const maxMotive = self.getMaxMotive();
    if (
      typeof personalityValues[personalityValueList.patience] !== 'number' ||
      typeof personalityValues[personalityValueList.kindness] !== 'number'
    ) {
      console.error(
        `Error: no personality value found for ${personalityValues[personalityValueList.patience]} or ${personalityValues[personalityValueList.kindness]}`
      );
      return;
    }

    const roll = Math.random();
    const amISad =
      personalityValues[personalityValueList.patience] / maxMotive > roll &&
      personalityValues[personalityValueList.kindness] / maxMotive > roll;
    const emotion = amISad ? emotionList.sad : emotionList.angry;

    const increment = 5;
    const updatedEmotion = emotions[emotion] + increment;
    goal.setEmotion({
      name: emotion,
      value: updatedEmotion < maxMotive ? updatedEmotion : maxMotive,
    });

    self.setState(stateList.missingItem);
    self.getState().execute(self);
  }
}
