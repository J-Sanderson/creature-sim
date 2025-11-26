/**
 * @jest-environment jsdom
 */

import { DebugManager } from '../../../src/managers/DebugManager';
import { worldBuilder } from '../../helpers/worldBuilder';
import { creatureBuilder } from '../../helpers/creatureBuilder';
import { motiveList, emotionList } from '../../../src/defaults';

describe('updateCreatureSliders', () => {
  let debugManager;
  let world;
  let creatures;

  const maxMotive = 100;

  beforeEach(() => {
    debugManager = new DebugManager();
    world = worldBuilder({
      entities: {
        items: [],
        creatures: [
          creatureBuilder({
            id: 'c-1',
            motiveByMotive: {
              [motiveList.hydration]: 50,
              [motiveList.fullness]: 60,
              [motiveList.energy]: 70,
            },
            emotionByValue: {
              [emotionList.angry]: 10,
              [emotionList.happy]: 20,
              [emotionList.sad]: 30,
            },
          }),
          creatureBuilder({
            id: 'c-2',
            motiveByMotive: {
              [motiveList.hydration]: 50,
              [motiveList.fullness]: 60,
              [motiveList.energy]: 70,
            },
            emotionByValue: {
              [emotionList.angry]: 10,
              [emotionList.happy]: 20,
              [emotionList.sad]: 30,
            },
          }),
        ],
      },
    });
    world.params = { maxMotive };
    debugManager.showStatusWrapper(world);
    creatures = world.getCreatures();
    creatures.forEach((creature) => {
      debugManager.showCreatureSliders(world, creature);
      jest.spyOn(creature, 'setOutput').mockImplementation(() => {});
    });
  });

  test('runs setOutput for each motive and creature', () => {
    creatures.forEach((creature) => {
      debugManager.updateCreatureSliders(creature);
      const motives = creature.getMotives();
      for (let motive in motives) {
        expect(creature.setOutput).toHaveBeenCalledWith(
          `slider-${motive}`,
          motives[motive],
          true
        );
      }
    });
  });

  test('runs setOutput for each emotion and creature', () => {
    creatures.forEach((creature) => {
      debugManager.updateCreatureSliders(creature);
      const emotions = creature.getEmotions();
      for (let emotion in emotions) {
        expect(creature.setOutput).toHaveBeenCalledWith(
          `slider-${emotion}`,
          emotions[emotion],
          true
        );
      }
    });
  });

  test('runs setOutput correct number of times', () => {
    creatures.forEach((creature) => {
      const motives = creature.getMotives();
      const emotions = creature.getEmotions();
      const calls = Object.keys(motives).length + Object.keys(emotions).length;

      debugManager.updateCreatureSliders(creature);
      expect(creature.setOutput).toHaveBeenCalledTimes(calls);
    });
  });
});
