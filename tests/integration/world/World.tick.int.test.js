/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';
import { World } from '../../../src/world/World';

beforeEach(() => {
  jest.spyOn(global, 'setInterval').mockImplementation(() => {});
  jest.clearAllMocks();
});
afterEach(() => jest.restoreAllMocks());

describe('tick', () => {
  test('runs update method for all creatures', () => {
    const el = document.createElement('div');
    const world = new World(el);
    const creatures = world.getCreatures();

    creatures.forEach((creature) => {
      jest.spyOn(creature, 'update').mockImplementation(() => {});
    });

    world.tick();

    creatures.forEach((creature) => {
      expect(creature.update).toHaveBeenCalledTimes(1);
    });
  });

  test('runs manager updates for all creatures', () => {
    const el = document.createElement('div');
    const world = new World(el);
    const creatures = world.getCreatures();

    creatures.forEach((creature) => {
      jest
        .spyOn(creature.metabolismManager, 'update')
        .mockImplementation(() => {});
      jest.spyOn(creature.goalManager, 'update').mockImplementation(() => {});
      jest
        .spyOn(creature.emotionManager, 'update')
        .mockImplementation(() => {});
    });

    world.tick();

    creatures.forEach((creature) => {
      expect(creature.metabolismManager.update).toHaveBeenCalledTimes(1);
      expect(creature.goalManager.update).toHaveBeenCalledTimes(1);
      expect(creature.emotionManager.update).toHaveBeenCalledTimes(1);
    });
  });
});
