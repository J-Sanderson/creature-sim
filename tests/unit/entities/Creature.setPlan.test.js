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
const mockPlanWander = { name: 'wander-plan' };
const mockPlanEat = { name: 'eat-plan' };
jest.mock('../../../src/state_machine/plans', () => ({
  __esModule: true,
  default: {
    planWander: jest.fn(() => mockPlanWander),
    planEat: jest.fn(() => mockPlanEat),
  },
}));

import { World as MockWorld } from '../../../src/world/World';
import Creature from '../../../src/entities/Creature';
import worldManager from '../../../src/managers/WorldManager';
import plans from '../../../src/state_machine/plans';
import { planList } from '../../../src/defaults';

describe('setPlan', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
  });

  test('sets current plan to null if no plan passed', () => {
    const creature = new Creature('w-1');

    creature.setPlan(planList.wander);
    creature.setPlan('');
    expect(creature.status.plan).toBeNull();
  });

  test('sets given plan if no plan currently set', () => {
    const creature = new Creature('w-1');
    creature.status.plan = null;

    creature.setPlan(planList.wander);
    expect(plans.planWander).toHaveBeenCalledTimes(1);
    expect(creature.status.plan).toEqual({ name: 'wander-plan' });
  });

  test('sets new plan in place of existing plan', () => {
    const creature = new Creature('w-1');
    creature.setPlan(planList.wander);
    const plan = creature.status.plan;
    creature.setPlan(planList.eat);

    expect(plans.planWander).toHaveBeenCalledTimes(1);
    expect(plans.planEat).toHaveBeenCalledTimes(1);
    expect(creature.status.plan).toEqual({ name: 'eat-plan' });
    expect(creature.status.plan).not.toBe(plan);
  });

  test('does not reset plan if same plan name already set', () => {
    const creature = new Creature('w-1');
    creature.setPlan(planList.wander);
    const plan = creature.status.plan;
    creature.setPlan(planList.wander);

    expect(creature.status.plan).toBe(plan);
  });
});
