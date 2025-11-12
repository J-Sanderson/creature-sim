/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';

import { World as MockWorld } from '../../../src/world/World';
import Creature from '../../../src/entities/Creature';
import worldManager from '../../../src/managers/WorldManager';
import { utilities } from '../../../src/utils/Utilities';
import {
  motiveList,
  personalityValueList,
  planList,
  stateList,
} from '../../../src/defaults';

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

describe('getters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getPersonalityValues', () => {
    test('returns object of personality values', () => {
      const creature = new Creature('w-1');
      const result = creature.getPersonalityValues();

      expect(typeof result).toBe('object');
      expect(result).toBe(creature.personality.values);
      Creature.validPersonalityValues.forEach((value) => {
        expect(result).toHaveProperty(value);
      });
    });
  });

  describe('getPersonalityValue', () => {
    test('displays error if value is not valid', () => {
      const error = jest
        .spyOn(console, 'error')
        .mockImplementation(function () {});
      const creature = new Creature('w-1');
      const value = 'not-a-value';
      const result = creature.getPersonalityValue(value);

      expect(error).toHaveBeenCalledTimes(1);
      expect(error).toHaveBeenCalledWith(
        `Error: no ${value} personality value found`
      );
      expect(result).toBeUndefined();
    });

    test('returns value if it exists', () => {
      const val = 50;
      jest.spyOn(utilities, 'rand').mockReturnValue(val);

      const creature = new Creature('w-1');
      const result = creature.getPersonalityValue(
        personalityValueList.finickiness
      );
      expect(result).toBe(val);
    });
  });

  describe('getEmotions', () => {
    test('returns object of emotion values', () => {
      const creature = new Creature('w-1');
      const result = creature.getEmotions();

      expect(typeof result).toBe('object');
      Creature.validEmotions.forEach((value) => {
        expect(result).toHaveProperty(value);
      });
    });

    test('returns same object from getStatus', () => {
      const creature = new Creature('w-1');
      const result = creature.getEmotions();

      expect(result).toBe(creature.getStatus().emotions);
    });
  });

  describe('getFavorites', () => {
    test('returns object of favorites', () => {
      const creature = new Creature('w-1');
      const result = creature.getFavorites();

      expect(typeof result).toBe('object');
      expect(result).toBe(creature.personality.favorites);
      expect(result).toHaveProperty('flavor');
      expect(result).toHaveProperty('color');
      expect(Creature.validFaves.flavors).toContain(result.flavor);
      expect(Creature.validFaves.colors).toContain(result.color);
    });
  });

  describe('getDesireThresholds', () => {
    test('calls MetabolismManager.getDesireThresholds', () => {
      const thresholds = { fullness: 50 };
      const creature = new Creature('w-1');
      creature.metabolismManager.getDesireThresholds = jest
        .fn()
        .mockReturnValue(thresholds);
      const result = creature.getDesireThresholds();

      expect(
        creature.metabolismManager.getDesireThresholds
      ).toHaveBeenCalledTimes(1);
      expect(result).toBe(thresholds);
    });
  });

  describe('getDesireThreshold', () => {
    test('calls MetabolismManager.getDesireThreshold with given motive', () => {
      const threshold = 50;
      const creature = new Creature('w-1');
      creature.metabolismManager.getDesireThreshold = jest
        .fn()
        .mockReturnValue(threshold);
      const result = creature.getDesireThreshold(motiveList.fullness);

      expect(
        creature.metabolismManager.getDesireThreshold
      ).toHaveBeenCalledTimes(1);
      expect(
        creature.metabolismManager.getDesireThreshold
      ).toHaveBeenCalledWith(motiveList.fullness);
      expect(result).toBe(threshold);
    });
  });

  describe('getGoals', () => {
    test('calls GoalManager.getGoals', () => {
      const goals = {
        goal1: {
          goalToken: { priority: 1, suspended: true, ticks: 5, calledBy: null },
          worldToken: { target: null },
        },
      };
      const creature = new Creature('w-1');
      creature.goalManager.getGoals = jest.fn().mockReturnValue(goals);
      const result = creature.getGoals();

      expect(creature.goalManager.getGoals).toHaveBeenCalledTimes(1);
      expect(result).toBe(goals);
    });
  });

  describe('getCurrentGoalName', () => {
    test('calls GoalManager.getCurrentGoalName', () => {
      const goal = 'goalEat';
      const creature = new Creature('w-1');
      creature.goalManager.getCurrentGoalName = jest.fn().mockReturnValue(goal);
      const result = creature.getCurrentGoalName();

      expect(creature.goalManager.getCurrentGoalName).toHaveBeenCalledTimes(1);
      expect(result).toBe(goal);
    });
  });

  describe('getPlan', () => {
    test('returns undefined if no plan has been set', () => {
      const creature = new Creature('w-1');
      const result = creature.getPlan();

      expect(result).toBeUndefined();
    });

    test('returns null if plan later unset', () => {
      const creature = new Creature('w-1');
      creature.setPlan(planList.eat);
      creature.setPlan('');
      const result = creature.getPlan();

      expect(result).toBeNull();
    });

    test('returns current plan name if set', () => {
      const creature = new Creature('w-1');
      creature.setPlan(planList.eat);
      const result = creature.getPlan();

      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('name');
      expect(result.name).toBe(planList.eat);
    });
  });

  describe('getState', () => {
    test('returns undefined if no state has been set', () => {
      const creature = new Creature('w-1');
      const result = creature.getState();

      expect(result).toBeUndefined();
    });

    test('returns current state if set', () => {
      const creature = new Creature('w-1');
      creature.setState(stateList.eat);
      const result = creature.getState();

      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('name');
      expect(result.name).toBe(stateList.eat);
    });
  });
});
