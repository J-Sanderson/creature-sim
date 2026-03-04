/**
 * @jest-environment jsdom
 */

import { GoalManager } from '../../../src/managers/GoalManager';
import { goalList } from '../../../src/defaults';

describe('getters', () => {
  const mockGoal = (name) => ({ name });

  let goalManager;
  let currentGoalName = goalList.sleep;
  let goals = {
    [goalList.sleep]: mockGoal(goalList.sleep),
    [goalList.eat]: mockGoal(goalList.eat),
  };
  beforeEach(() => {
    jest.clearAllMocks();
    goalManager = new GoalManager();
    goalManager.currentGoalName = currentGoalName;
    goalManager.goals = goals;
  });
  afterEach(() => jest.restoreAllMocks());

  describe('getGoals', () => {
    test('returns object of goals', () => {
      const result = goalManager.getGoals();
      expect(result).toEqual(goals);
    });
  });

  describe('getCurrentGoalName', () => {
    test('returns current goal name string', () => {
      const result = goalManager.getCurrentGoalName();
      expect(result).toBe(currentGoalName);
    });
  });

  describe('getCurrentGoal', () => {
    test('returns goal corresponding to current goal name', () => {
      const result = goalManager.getCurrentGoal();
      expect(result).toBe(goals[currentGoalName]);
    });

    test('returns undefined if current goal name is not listed in goals', () => {
      goalManager.currentGoalName = goalList.wander;
      const result = goalManager.getCurrentGoal();
      expect(result).toBeUndefined();
    });

    test('returns undefined if current goal name is blank', () => {
      goalManager.currentGoalName = '';
      const result = goalManager.getCurrentGoal();
      expect(result).toBeUndefined();
    });
  });
});
