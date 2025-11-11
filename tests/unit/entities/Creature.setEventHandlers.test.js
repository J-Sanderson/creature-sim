/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';
import { World as MockWorld } from '../../../src/world/World';
import Creature from '../../../src/entities/Creature';
import worldManager from '../../../src/managers/WorldManager';
import { goalList } from '../../../src/defaults';

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

jest.mock('../../../src/managers/GoalManager', () => {
  const GoalManager = jest.fn().mockImplementation(() => ({
    addGoal: jest.fn(),
    deleteGoal: jest.fn(),
  }));
  return { __esModule: true, GoalManager };
});

describe('setEventHandlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
  });

  test('adds functions to event handler object', () => {
    const creature = new Creature('w-1');

    expect(creature.eventHandlers).toEqual(
      expect.objectContaining({
        petStart: expect.any(Function),
        petStop: expect.any(Function),
        itemAdded: expect.any(Function),
        itemDeleted: expect.any(Function),
      })
    );
  });

  test('adds event listeners to icon', () => {
    const icon = document.createElement('div');
    jest.spyOn(Creature.prototype, 'init').mockImplementation(function () {
      this.outputs = { icon };
    });
    const addListener = jest.spyOn(icon, 'addEventListener');
    new Creature('w-1');

    expect(addListener).toHaveBeenCalledTimes(4);
    expect(addListener).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(addListener).toHaveBeenCalledWith('mouseup', expect.any(Function));
    expect(addListener).toHaveBeenCalledWith('addItem', expect.any(Function));
    expect(addListener).toHaveBeenCalledWith(
      'deleteItem',
      expect.any(Function)
    );
  });

  test('calls petStart on mousedown', () => {
    const creature = new Creature('w-1');
    creature.outputs.icon.dispatchEvent(new MouseEvent('mousedown'));

    expect(creature.goalManager.addGoal).toHaveBeenCalledTimes(1);
    expect(creature.goalManager.addGoal).toHaveBeenCalledWith(
      creature,
      goalList.pet,
      expect.objectContaining({
        priority: 1,
        suspended: false,
        ticks: 5,
        tickModifiers: {
          personality: creature.personality.values,
          maxMotive: creature.maxMotive,
        },
      })
    );
  });

  test('calls petStop on mouseup', () => {
    const creature = new Creature('w-1');
    creature.outputs.icon.dispatchEvent(new MouseEvent('mouseup'));

    expect(creature.goalManager.deleteGoal).toHaveBeenCalledTimes(1);
    expect(creature.goalManager.deleteGoal).toHaveBeenCalledWith(goalList.pet);
  });

  test('calls itemAdded on addItem', () => {
    const creature = new Creature('w-1');
    const event = new CustomEvent('addItem');
    creature.outputs.icon.dispatchEvent(event);

    expect(creature.goalManager.addGoal).toHaveBeenCalledTimes(1);
    expect(creature.goalManager.addGoal).toHaveBeenCalledWith(
      creature,
      goalList.addedItem,
      expect.objectContaining({
        priority: 5,
        suspended: false,
        ticks: 1,
        target: event.detail,
      })
    );
  });

  test('calls itemDeleted on deleteItem', () => {
    const creature = new Creature('w-1');
    const event = new CustomEvent('deleteItem');
    creature.outputs.icon.dispatchEvent(event);

    expect(creature.goalManager.addGoal).toHaveBeenCalledTimes(1);
    expect(creature.goalManager.addGoal).toHaveBeenCalledWith(
      creature,
      goalList.missingItem,
      expect.objectContaining({
        priority: 5,
        suspended: false,
        ticks: 1,
        target: event.detail,
      })
    );
  });
});
