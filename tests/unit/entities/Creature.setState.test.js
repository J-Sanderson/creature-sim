/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';

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
const mockStateWander = { name: 'wander-state' };
const mockStateEat = { name: 'eat-state' };
jest.mock('../../../src/state_machine/states', () => ({
  __esModule: true,
  default: {
    stateMoveRandomly: jest.fn(() => mockStateWander),
    stateEat: jest.fn(() => mockStateEat),
  },
}));

import { World as MockWorld } from '../../../src/world/World';
import Creature from '../../../src/entities/Creature';
import worldManager from '../../../src/managers/WorldManager';
import states from '../../../src/state_machine/states';
import { stateList } from '../../../src/defaults';

describe('setState', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
  });

  test('sets given state if no state currently set', () => {
    const creature = new Creature('w-1');
    creature.status.state = null;

    creature.setState(stateList.wander);
    expect(states.stateMoveRandomly).toHaveBeenCalledTimes(1);
    expect(creature.status.state).toEqual({ name: 'wander-state' });
  });

  test('sets new state in place of existing state', () => {
    const creature = new Creature('w-1');
    creature.setState(stateList.wander);
    const state = creature.status.state;
    creature.setState(stateList.eat);

    expect(states.stateMoveRandomly).toHaveBeenCalledTimes(1);
    expect(states.stateEat).toHaveBeenCalledTimes(1);
    expect(creature.status.state).toEqual({ name: 'eat-state' });
    expect(creature.status.state).not.toBe(state);
  });

  test('does not reset state if same state name already set', () => {
    const creature = new Creature('w-1');
    creature.setState(stateList.wander);
    const state = creature.status.state;
    creature.setState(stateList.wander);

    expect(creature.status.state).toBe(state);
  });
});
