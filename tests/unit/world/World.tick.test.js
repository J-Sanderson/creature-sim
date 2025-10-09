/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';
import { World } from '../../../src/world/World';
import { creatureBuilder } from '../../helpers/creatureBuilder';

jest.mock('../../../src/managers/DebugManager', () => {
  const instance = {
    updateCreatureStatus: jest.fn(),
    updateCreatureSliders: jest.fn(),
  };
  const DebugManager = jest.fn(() => instance);
  return { __esModule: true, DebugManager };
});

describe('tick', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(World.prototype, 'init').mockImplementation(function () {
      const creature1 = creatureBuilder({ position: { x: 0, y: 0 } });
      const creature2 = creatureBuilder({ position: { x: 1, y: 1 } });
      jest.spyOn(creature1, 'update').mockImplementation(() => {});
      jest.spyOn(creature2, 'update').mockImplementation(() => {});
      this.entities.creatures.set('creature-1', creature1);
      this.entities.creatures.set('creature-2', creature2);
    });
  });
  afterEach(() => jest.restoreAllMocks());

  test('runs update function for each creature', () => {
    const el = document.createElement('div');
    const world = new World(el);
    world.tick();

    expect(
      world.entities.creatures.get('creature-1').update
    ).toHaveBeenCalledTimes(1);
    expect(
      world.entities.creatures.get('creature-2').update
    ).toHaveBeenCalledTimes(1);
  });

  test('does not run debug manager functions by default', () => {
    const el = document.createElement('div');
    const world = new World(el);
    world.tick();

    expect(world.debugManager.updateCreatureStatus).not.toHaveBeenCalled();
    expect(world.debugManager.updateCreatureSliders).not.toHaveBeenCalled();
  });

  test('runs status update for each creature if specified', () => {
    const el = document.createElement('div');
    const world = new World(el, { showStatus: true });
    world.tick();

    expect(world.debugManager.updateCreatureStatus).toHaveBeenCalledTimes(2);
    expect(world.debugManager.updateCreatureStatus).toHaveBeenNthCalledWith(
      1,
      world.entities.creatures.get('creature-1')
    );
    expect(world.debugManager.updateCreatureStatus).toHaveBeenNthCalledWith(
      2,
      world.entities.creatures.get('creature-2')
    );
    expect(world.debugManager.updateCreatureSliders).not.toHaveBeenCalled();
  });

  test('runs slider update for each creature if specified', () => {
    const el = document.createElement('div');
    const world = new World(el, { showSliders: true });
    world.tick();

    expect(world.debugManager.updateCreatureStatus).not.toHaveBeenCalled();
    expect(world.debugManager.updateCreatureSliders).toHaveBeenCalledTimes(2);
    expect(world.debugManager.updateCreatureSliders).toHaveBeenNthCalledWith(
      1,
      world.entities.creatures.get('creature-1')
    );
    expect(world.debugManager.updateCreatureSliders).toHaveBeenNthCalledWith(
      2,
      world.entities.creatures.get('creature-2')
    );
  });
});
