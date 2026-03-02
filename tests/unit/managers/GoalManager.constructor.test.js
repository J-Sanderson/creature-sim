/**
 * @jest-environment jsdom
 */

import { GoalManager } from '../../../src/managers/GoalManager';

describe('constructor', () => {
  test('creates empty goals object', () => {
    const goalManager = new GoalManager();
    expect(goalManager.goals).toEqual({});
  });

  test('creates empty currentGoal string', () => {
    const goalManager = new GoalManager();
    expect(goalManager.currentGoalName).toBe('');
  });
});
