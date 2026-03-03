/**
 * @jest-environment jsdom
 */

import { GoalManager } from '../../../src/managers/GoalManager';
import { goalList } from '../../../src/defaults';

describe('suspendGoal', () => {
  const mockGoal = () => ({
    suspend: jest.fn(),
  });

  let goalManager;
  beforeEach(() => {
    jest.clearAllMocks();
    goalManager = new GoalManager();
    goalManager.goals[goalList.sleep] = mockGoal();
    goalManager.goals[goalList.eat] = mockGoal();
  });
  afterEach(() => jest.restoreAllMocks());

  test('runs suspend function for given goal', () => {
    const goal = goalList.sleep;
    goalManager.suspendGoal(goal);
    expect(goalManager.goals[goal].suspend).toHaveBeenCalledTimes(1);
  });

  test('does nothing if given goal is not present', () => {
    const goal = goalList.wander;
    expect(() => goalManager.suspendGoal(goal)).not.toThrow();
  });
});

describe('unsuspendGoal', () => {
  const mockGoal = () => ({
    unsuspend: jest.fn(),
  });

  let goalManager;
  beforeEach(() => {
    jest.clearAllMocks();
    goalManager = new GoalManager();
    goalManager.goals[goalList.sleep] = mockGoal();
    goalManager.goals[goalList.eat] = mockGoal();
  });
  afterEach(() => jest.restoreAllMocks());

  test('runs unsuspend function for given goal', () => {
    const goal = goalList.sleep;
    goalManager.unsuspendGoal(goal);
    expect(goalManager.goals[goal].unsuspend).toHaveBeenCalledTimes(1);
  });

  test('does nothing if given goal is not present', () => {
    const goal = goalList.wander;
    expect(() => goalManager.unsuspendGoal(goal)).not.toThrow();
  });
});

describe('deleteGoal', () => {
  const mockGoal = () => ({
    unsuspend: jest.fn(),
  });

  let goalManager;
  beforeEach(() => {
    jest.clearAllMocks();
    goalManager = new GoalManager();
    goalManager.currentGoalName = goalList.sleep;
    goalManager.goals[goalList.sleep] = mockGoal();
    goalManager.goals[goalList.eat] = mockGoal();
  });
  afterEach(() => jest.restoreAllMocks());

  test('removes goal from goals list', () => {
    const goal = goalList.sleep;
    goalManager.deleteGoal(goal);
    expect(goalManager.goals).not.toHaveProperty(goal);
    expect(Object.keys(goalManager.goals)).toHaveLength(1);
  });

  test('clears currentGoalName', () => {
    const goal = goalList.sleep;
    goalManager.deleteGoal(goal);
    expect(goalManager.currentGoalName).toBe('');
  });

  test('makes no changes if goal not present', () => {
    const goal = goalList.wander;
    goalManager.deleteGoal(goal);

    expect(Object.keys(goalManager.goals)).toHaveLength(2);
    expect(goalManager.goals).toHaveProperty(goalList.sleep);
    expect(goalManager.goals).toHaveProperty(goalList.eat);
    expect(goalManager.currentGoalName).toBe(goalList.sleep);
  });
});
