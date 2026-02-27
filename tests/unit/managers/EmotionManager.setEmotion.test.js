/**
 * @jest-environment jsdom
 */

import { EmotionManager } from '../../../src/managers/EmotionManager';
import { creatureBuilder } from '../../helpers/creatureBuilder';
import { emotionList } from '../../../src/defaults';

describe('setEmotion', () => {
  let creatures;
  beforeEach(() => {
    jest.clearAllMocks();
    creatures = [
      creatureBuilder({
        id: 'c-1',
        emotionByValue: {
          [emotionList.angry]: 10,
          [emotionList.happy]: 20,
          [emotionList.sad]: 30,
        },
      }),
      creatureBuilder({
        id: 'c-2',
        emotionByValue: {
          [emotionList.angry]: 10,
          [emotionList.happy]: 20,
          [emotionList.sad]: 30,
        },
      }),
    ];
    creatures.forEach((creature) => {
      creature.emotionManager = new EmotionManager();
      creature.update = () => {
        creature.emotionManager.update(creature);
      };
      creature.status = { emotions: creature.getEmotions() };
    });
  });
  afterEach(() => jest.restoreAllMocks());

  test('does not set emotions if emotion is not passed', () => {
    creatures.forEach((creature) => {
      jest.spyOn(creature, 'getMaxMotive').mockImplementation(() => {});
      const emotions = creature.getEmotions();

      creature.emotionManager.setEmotion(creature, null, 10);
      expect(creature.getMaxMotive).toHaveBeenCalledTimes(0);

      const emotionsNew = creature.getEmotions();
      expect(emotionsNew).toEqual(emotions);
    });
  });

  test('does not set emotions if value is not passed', () => {
    creatures.forEach((creature) => {
      jest.spyOn(creature, 'getMaxMotive').mockImplementation(() => {});
      const emotions = creature.getEmotions();

      creature.emotionManager.setEmotion(creature, emotionList.angry, null);
      expect(creature.getMaxMotive).toHaveBeenCalledTimes(0);

      const emotionsNew = creature.getEmotions();
      expect(emotionsNew).toEqual(emotions);
    });
  });

  test('does not set emotions if value is less than zero', () => {
    creatures.forEach((creature) => {
      jest.spyOn(creature, 'getMaxMotive').mockImplementation(() => {});
      const emotions = creature.getEmotions();

      creature.emotionManager.setEmotion(creature, emotionList.angry, -1);
      expect(creature.getMaxMotive).toHaveBeenCalledTimes(0);

      const emotionsNew = creature.getEmotions();
      expect(emotionsNew).toEqual(emotions);
    });
  });

  test('does not set emotions and displays error if emotion is not present', () => {
    creatures.forEach((creature) => {
      jest.spyOn(creature, 'getMaxMotive').mockImplementation(() => {});
      const err = jest.spyOn(console, 'error').mockImplementation(() => {});
      const emotions = creature.getEmotions();

      creature.emotionManager.setEmotion(creature, 'not-an-emotion', 10);
      expect(err).toHaveBeenCalledWith('Invalid emotion');
      expect(creature.getMaxMotive).toHaveBeenCalledTimes(0);

      const emotionsNew = creature.getEmotions();
      expect(emotionsNew).toEqual(emotions);
    });
  });

  test('sets emotion to max motive if value is greater than max motive', () => {
    creatures.forEach((creature) => {
      const maxMotive = creature.getMaxMotive();

      creature.emotionManager.setEmotion(
        creature,
        emotionList.angry,
        maxMotive + 1
      );
      expect(creature.status.emotions[emotionList.angry]).toBe(maxMotive);
    });
  });

  test('sets emotion to value if value is not greater than max motive', () => {
    creatures.forEach((creature) => {
      const maxMotive = creature.getMaxMotive();
      const value = maxMotive - 1;

      creature.emotionManager.setEmotion(creature, emotionList.angry, value);
      expect(creature.status.emotions[emotionList.angry]).toBe(value);
    });
  });
});
