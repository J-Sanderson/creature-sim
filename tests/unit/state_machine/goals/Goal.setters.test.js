/**
 * @jest-environment jsdom
 */

import Goal from '../../../../src/state_machine/goals/Goal';
import {
  goalList,
  motiveIconList,
  adjectiveList,
} from '../../../../src/defaults';
import { utilities } from '../../../../src/utils/Utilities';

describe('setters', () => {
  let goal;
  beforeEach(() => {
    jest.clearAllMocks();
    goal = new Goal();
  });
  afterEach(() => jest.restoreAllMocks());

  describe('suspend', () => {
    test('suspends goal', () => {
      expect(goal.goalToken.suspended).toBe(false);
      goal.suspend();
      expect(goal.goalToken.suspended).toBe(true);
    });
  });

  describe('unsuspend', () => {
    test('unsuspends goal', () => {
      goal.goalToken.suspended = true;
      goal.unsuspend();
      expect(goal.goalToken.suspended).toBe(false);
    });
  });

  describe('setPriority', () => {
    test('sets priority', () => {
      const priority = 2;
      goal.setPriority(priority);
      expect(goal.goalToken.priority).toBe(priority);
    });
  });

  describe('setTarget', () => {
    test('sets target', () => {
      const target = utilities.generateGUID();
      goal.setTarget(target);
      expect(goal.worldToken.target).toBe(target);
    });
  });

  describe('setDirection', () => {
    test('sets direction', () => {
      const x = 5;
      const y = 6;
      goal.setDirection(x, y);
      expect(goal.worldToken.direction).toEqual({ x, y });
    });

    test('sets y co-ordinate to 0 if not specified', () => {
      const x = 5;
      goal.setDirection(x);
      expect(goal.worldToken.direction.x).toBe(x);
      expect(goal.worldToken.direction.y).toBe(0);
    });

    test('sets x co-ordinate to 0 if not specified', () => {
      const y = 6;
      goal.setDirection(undefined, y);
      expect(goal.worldToken.direction.x).toBe(0);
      expect(goal.worldToken.direction.y).toBe(y);
    });

    test('sets both coordinates to 0 if none passed', () => {
      goal.setDirection();
      expect(goal.worldToken.direction.x).toBe(0);
      expect(goal.worldToken.direction.y).toBe(0);
    });
  });

  describe('setMotiveIcon', () => {
    test('sets motive icon', () => {
      const icon = motiveIconList.hunger;
      goal.setMotiveIcon(icon);
      expect(goal.goalToken.motiveIcon).toBe(icon);
    });
  });

  describe('setAdjective', () => {
    test('sets adjective', () => {
      const adj = adjectiveList.tasty;
      goal.setAdjective(adj);
      expect(goal.worldToken.adjective).toBe(adj);
    });
  });
});
