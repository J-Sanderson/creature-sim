/**
 * @jest-environment jsdom
 */

import { EmotionManager } from '../../../src/managers/EmotionManager';
import { creatureBuilder } from '../../helpers/creatureBuilder';
import { emotionList, stateList } from '../../../src/defaults';

describe('update', () => {
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
    });
  });
  afterEach(() => jest.restoreAllMocks());

  test('runs getEmotions for each creature', () => {
    creatures.forEach((creature) => {
      jest.spyOn(creature, 'getEmotions').mockImplementation(() => {});
      creature.update();

      expect(creature.getEmotions).toHaveBeenCalledTimes(1);
    });
  });

  test('runs getState for each creature', () => {
    creatures.forEach((creature) => {
      jest.spyOn(creature, 'getState').mockImplementation(() => {});
      creature.update();

      expect(creature.getState).toHaveBeenCalledTimes(1);
    });
  });

  test('runs setEmotion if state does not supress emotional decay', () => {
    creatures.forEach((creature) => {
      jest
        .spyOn(creature, 'getState')
        .mockReturnValue({ name: stateList.wander, suppressEmotionDecay: [] });
      jest
        .spyOn(creature.emotionManager, 'setEmotion')
        .mockImplementation(() => {});

      const emotions = creature.getEmotions();
      creature.update();

      for (let emotion in emotions) {
        expect(creature.emotionManager.setEmotion).toHaveBeenCalledWith(
          creature,
          emotion,
          emotions[emotion] - 1
        );
      }
    });
  });

  test('does not run setEmotion if state is blank', () => {
    creatures.forEach((creature) => {
      jest.spyOn(creature, 'getState').mockReturnValue('');
      jest
        .spyOn(creature.emotionManager, 'setEmotion')
        .mockImplementation(() => {});

      creature.update();

      expect(creature.emotionManager.setEmotion).toHaveBeenCalledTimes(0);
    });
  });

  test('does not run setEmotion if state supresses decay for given emotion', () => {
    creatures.forEach((creature) => {
      jest
        .spyOn(creature, 'getState')
        .mockReturnValue({
          name: stateList.wander,
          suppressEmotionDecay: [emotionList.angry],
        });
      jest
        .spyOn(creature.emotionManager, 'setEmotion')
        .mockImplementation(() => {});

      const emotions = creature.getEmotions();
      creature.update();

      for (let emotion in emotions) {
        if (emotion !== emotionList.angry) {
          expect(creature.emotionManager.setEmotion).toHaveBeenCalledWith(
            creature,
            emotion,
            emotions[emotion] - 1
          );
        }
      }

      expect(creature.emotionManager.setEmotion).not.toHaveBeenCalledWith(
        creature,
        emotionList.angry,
        emotions[emotionList.angry] - 1
      );

      expect(creature.emotionManager.setEmotion).toHaveBeenCalledTimes(
        Object.keys(emotionList).length - 1
      );
    });
  });
});
