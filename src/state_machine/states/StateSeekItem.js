import State from './State';
import worldManager from '../../managers/WorldManager';
import { stateList, emotionList, personalityValueList } from '../../defaults';

export default class StateSeekItem extends State {
  constructor(params) {
    super(params);

    this.name = stateList.seekItem;
    this.suppressEmotionDecay.push(emotionList.sad);
  }

  execute(self, motive, pos) {
    const emotions = self.getEmotions();
    self.emotionManager.setEmotion(
      self,
      emotionList.happy,
      emotions[emotionList.happy] - 1
    );

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
    self.emotionManager.setEmotion(self, emotion, emotions[emotion] + 2);

    self.showMotive(motive ? motive : '');

    self.setXPosition(pos.x);
    self.setYPosition(pos.y);
    const world = worldManager.getWorld(self.world);
    world.moveEntity(self.outputs.icon, self.getPosition());
  }
}
