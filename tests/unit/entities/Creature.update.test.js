/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';
import { World as MockWorld } from '../../../src/world/World';
import Creature from '../../../src/entities/Creature';
import worldManager from '../../../src/managers/WorldManager';

jest.mock('../../../src/world/World', () => {
  const MockWorld = class World {
    constructor() {
      this.params = { maxMotive: 100 };
    }
    getParam(param) {
      return this.params[param];
    }
    displayEntity() {
      return jest.fn();
    }
    getBounds() {
      return { x: 5, y: 6 };
    }
  };
  return { __esModule: true, World: MockWorld };
});

jest.mock('../../../src/managers/MetabolismManager', () => {
  const MetabolismManager = jest.fn().mockImplementation(() => ({
    update: jest.fn(),
  }));
  return { __esModule: true, MetabolismManager };
});
jest.mock('../../../src/managers/GoalManager', () => {
  const GoalManager = jest.fn().mockImplementation(() => ({
    update: jest.fn(),
  }));
  return { __esModule: true, GoalManager };
});
jest.mock('../../../src/managers/EmotionManager', () => {
  const EmotionManager = jest.fn().mockImplementation(() => ({
    update: jest.fn(),
  }));
  return { __esModule: true, EmotionManager };
});

describe('update', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
  });

  test('calls metabolismManager.update', () => {
    const creature = new Creature('w-1');
    creature.update();

    expect(creature.metabolismManager.update).toHaveBeenCalledTimes(1);
    expect(creature.metabolismManager.update).toHaveBeenCalledWith(creature);
  });

  test('calls goalManager.update', () => {
    const creature = new Creature('w-1');
    creature.update();

    expect(creature.goalManager.update).toHaveBeenCalledTimes(1);
    expect(creature.goalManager.update).toHaveBeenCalledWith(creature);
  });

  test('calls emotionManager.update', () => {
    const creature = new Creature('w-1');
    creature.update();

    expect(creature.emotionManager.update).toHaveBeenCalledTimes(1);
    expect(creature.emotionManager.update).toHaveBeenCalledWith(creature);
  });
});
