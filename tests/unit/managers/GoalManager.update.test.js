/**
 * @jest-environment jsdom
 */

import { GoalManager } from '../../../src/managers/GoalManager';
import { goalList } from '../../../src/defaults';

describe('update', () => {
  let creature, goalManager, updateGoalPriorities;
  beforeEach(() => {
    jest.clearAllMocks();
    creature = {};
    goalManager = new GoalManager();
    updateGoalPriorities = jest
      .spyOn(goalManager, 'updateGoalPriorities')
      .mockImplementation(() => {});
  });
  afterEach(() => jest.restoreAllMocks());

  test('runs updateGoalPriorities', () => {
    goalManager.currentGoalName = goalList.wander;
    goalManager.goals = {
      [goalList.wander]: {
        name: goalList.wander,
        execute: jest.fn(),
        getIsSuspended: jest.fn().mockReturnValue(false),
      },
    };

    goalManager.update(creature);
    expect(updateGoalPriorities).toHaveBeenCalledWith(creature);
  });

  test('executes current goal if present', () => {
    goalManager.currentGoalName = goalList.wander;
    goalManager.goals = {
      [goalList.wander]: {
        name: goalList.wander,
        execute: jest.fn(),
        getIsSuspended: jest.fn().mockReturnValue(false),
      },
    };

    goalManager.update(creature);
    expect(goalManager.goals[goalList.wander].execute).toHaveBeenCalledWith(
      creature
    );
  });

  test('runs findInterestingGoals if no goals present', () => {
    jest.spyOn(goalManager, 'getCurrentGoal').mockReturnValueOnce(undefined);
    const findInterestingGoals = jest
      .spyOn(goalManager, 'findInterestingGoals')
      .mockImplementation(() => {
        goalManager.currentGoalName = goalList.wander;
        goalManager.goals = {
          [goalList.wander]: {
            name: goalList.wander,
            execute: jest.fn(),
          },
        };
      });

    goalManager.update(creature);
    expect(goalManager.getCurrentGoalName()).toBe(goalList.wander);
    expect(findInterestingGoals).toHaveBeenCalledWith(creature);
    expect(goalManager.goals[goalList.wander].execute).toHaveBeenCalledWith(
      creature
    );
  });

  test('executes valid unsuspended goal from list if current goal is suspended', () => {
    goalManager.currentGoalName = goalList.sleep;
    goalManager.goals = {
      [goalList.sleep]: {
        name: goalList.sleep,
        execute: jest.fn(),
        getIsSuspended: jest.fn().mockReturnValue(true),
        getPriority: jest.fn().mockReturnValue(1),
      },
      [goalList.eat]: {
        name: goalList.eat,
        execute: jest.fn(),
        getIsSuspended: jest.fn().mockReturnValue(false),
        getPriority: jest.fn().mockReturnValue(2),
      },
    };

    const getTopPriorityGoal = jest
      .spyOn(goalManager, 'getTopPriorityGoal')

    goalManager.update(creature);
    expect(getTopPriorityGoal).toHaveBeenCalledWith(true);
    expect(getTopPriorityGoal).not.toHaveBeenCalledWith();
    expect(goalManager.getCurrentGoalName()).toBe(goalList.eat);
    expect(goalManager.goals[goalList.eat].execute).toHaveBeenCalledWith(
      creature
    );
  });

  test('unsuspends and executes valid suspended goal from list if current goal is suspended', () => {
    goalManager.currentGoalName = goalList.eat;
    goalManager.goals = {
      [goalList.sleep]: {
        name: goalList.sleep,
        execute: jest.fn(),
        getIsSuspended: jest.fn().mockReturnValue(true),
        getPriority: jest.fn().mockReturnValue(1),
        unsuspend: jest.fn(),
      },
      [goalList.eat]: {
        name: goalList.eat,
        execute: jest.fn(),
        getIsSuspended: jest.fn().mockReturnValue(true),
        getPriority: jest.fn().mockReturnValue(2),
      },
    };

    const getTopPriorityGoal = jest
      .spyOn(goalManager, 'getTopPriorityGoal')
    const unsuspendGoal = jest
      .spyOn(goalManager, 'unsuspendGoal')

    goalManager.update(creature);
    expect(getTopPriorityGoal).toHaveBeenNthCalledWith(1, true);
    expect(getTopPriorityGoal).toHaveBeenNthCalledWith(2);
    expect(unsuspendGoal).toHaveBeenCalledWith(goalList.sleep);
    expect(goalManager.getCurrentGoalName()).toBe(goalList.sleep);
    expect(goalManager.goals[goalList.sleep].execute).toHaveBeenCalledWith(
      creature
    );
  });
});
