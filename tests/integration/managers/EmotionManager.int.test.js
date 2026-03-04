/**
 * @jest-environment jsdom
 */

import 'jest-canvas-mock';
import { World } from '../../../src/world/World';
import { emotionList, stateList } from '../../../src/defaults';

describe('EmotionManager', () => {
  let el, world, creatures;
  beforeEach(() => {
    jest.clearAllMocks();
    el = document.createElement('div');
    world = new World(el);
    creatures = world.getCreatures();
    jest.spyOn(World.prototype, 'tick').mockImplementation(function () {});
  });
  afterEach(() => jest.restoreAllMocks());

  test('decays all emotions by 1 if state does not supress it', () => {
    creatures.forEach((creature) => {
      const happiness = 10;
      const sadness = 20;
      const anger = 30;

      creature.status.emotions[emotionList.happy] = happiness;
      creature.status.emotions[emotionList.sad] = sadness;
      creature.status.emotions[emotionList.angry] = anger;
      creature.setState(stateList.wander);
      creature.emotionManager.update(creature);

      const emotions = creature.getEmotions();
      expect(emotions[emotionList.happy]).toBe(happiness - 1);
      expect(emotions[emotionList.sad]).toBe(sadness - 1);
      expect(emotions[emotionList.angry]).toBe(anger - 1);
    });
  });

  test('does not decay emotion if state supresses it', () => {
    creatures.forEach((creature) => {
      const happiness = 10;
      const sadness = 20;
      const anger = 30;

      creature.status.emotions[emotionList.happy] = happiness;
      creature.status.emotions[emotionList.sad] = sadness;
      creature.status.emotions[emotionList.angry] = anger;
      creature.setState(stateList.chewToy);
      creature.emotionManager.update(creature);

      const emotions = creature.getEmotions();
      expect(emotions[emotionList.happy]).toBe(happiness);
      expect(emotions[emotionList.sad]).toBe(sadness - 1);
      expect(emotions[emotionList.angry]).toBe(anger - 1);
    });
  });

  test('does not decay emotion if already at zero', () => {
    creatures.forEach((creature) => {
      const happiness = 0;
      const sadness = 20;
      const anger = 30;

      creature.status.emotions[emotionList.happy] = happiness;
      creature.status.emotions[emotionList.sad] = sadness;
      creature.status.emotions[emotionList.angry] = anger;
      creature.setState(stateList.wander);
      creature.emotionManager.update(creature);

      const emotions = creature.getEmotions();
      expect(emotions[emotionList.happy]).toBe(happiness);
      expect(emotions[emotionList.sad]).toBe(sadness - 1);
      expect(emotions[emotionList.angry]).toBe(anger - 1);
    });
  });
});
