/**
 * @jest-environment jsdom
 */

import { GoalManager } from '../../../src/managers/GoalManager';
import { goalList } from '../../../src/defaults';

describe('getTopPriorityGoal', () => {
  let goalManager;
  beforeEach(() => {
    jest.clearAllMocks();
    goalManager = new GoalManager();
  });
  afterEach(() => jest.restoreAllMocks());

  test('returns null if no goals present', () => {
    goalManager.goals = {};

    const result = goalManager.getTopPriorityGoal();
    expect(result).toBeNull();
  });

  test('returns null if all goals are suspended and excludeSuspended is true', () => {
    goalManager.goals = {
      [goalList.sleep]: {
        name: goalList.sleep,
        getIsSuspended: jest.fn().mockReturnValue(true),
      },
      [goalList.eat]: {
        name: goalList.eat,
        getIsSuspended: jest.fn().mockReturnValue(true),
      },
    };

    const result = goalManager.getTopPriorityGoal(true);
    expect(result).toBeNull();
  });

  test('runs getIsSuspended for all goals if excludeSuspended is true', () => {
    goalManager.goals = {
      [goalList.sleep]: {
        name: goalList.sleep,
        getIsSuspended: jest.fn().mockReturnValue(true),
        getPriority: jest.fn(),
      },
      [goalList.eat]: {
        name: goalList.eat,
        getIsSuspended: jest.fn().mockReturnValue(false),
        getPriority: jest.fn(),
      },
    };

    goalManager.getTopPriorityGoal(true);
    for (let goal in goalManager.goals) {
      expect(goalManager.goals[goal].getIsSuspended).toHaveBeenCalledTimes(1);
    }
  });

  test('does not run getIsSuspended for any goals if excludeSuspended is false', () => {
    goalManager.goals = {
      [goalList.sleep]: {
        name: goalList.sleep,
        getIsSuspended: jest.fn().mockReturnValue(true),
        getPriority: jest.fn(),
      },
      [goalList.eat]: {
        name: goalList.eat,
        getIsSuspended: jest.fn().mockReturnValue(false),
        getPriority: jest.fn(),
      },
    };

    goalManager.getTopPriorityGoal();
    for (let goal in goalManager.goals) {
      expect(goalManager.goals[goal].getIsSuspended).toHaveBeenCalledTimes(0);
    }
  });

  test('runs getPriority for unsuspended goals only if excludeSuspended is true', () => {
    goalManager.goals = {
      [goalList.sleep]: {
        name: goalList.sleep,
        getIsSuspended: jest.fn().mockReturnValue(true),
        getPriority: jest.fn(),
      },
      [goalList.eat]: {
        name: goalList.eat,
        getIsSuspended: jest.fn().mockReturnValue(false),
        getPriority: jest.fn(),
      },
    };

    goalManager.getTopPriorityGoal(true);
    expect(goalManager.goals[goalList.sleep].getPriority).toHaveBeenCalledTimes(
      0
    );
    expect(goalManager.goals[goalList.eat].getPriority).toHaveBeenCalledTimes(
      1
    );
  });

  test('runs getPriority for all goals if excludeSuspended is false', () => {
    goalManager.goals = {
      [goalList.sleep]: {
        name: goalList.sleep,
        getIsSuspended: jest.fn().mockReturnValue(true),
        getPriority: jest.fn(),
      },
      [goalList.eat]: {
        name: goalList.eat,
        getIsSuspended: jest.fn().mockReturnValue(false),
        getPriority: jest.fn(),
      },
    };

    goalManager.getTopPriorityGoal();
    for (let goal in goalManager.goals) {
      expect(goalManager.goals[goal].getPriority).toHaveBeenCalledTimes(1);
    }
  });

  test('returns highest priority unsuspended goal if excludeSuspended is true', () => {
    goalManager.goals = {
      [goalList.sleep]: {
        name: goalList.sleep,
        getIsSuspended: jest.fn().mockReturnValue(true),
        getPriority: jest.fn().mockReturnValue(1),
      },
      [goalList.eat]: {
        name: goalList.eat,
        getIsSuspended: jest.fn().mockReturnValue(false),
        getPriority: jest.fn().mockReturnValue(2),
      },
      [goalList.eat]: {
        name: goalList.wander,
        getIsSuspended: jest.fn().mockReturnValue(false),
        getPriority: jest.fn().mockReturnValue(3),
      },
    };

    const result = goalManager.getTopPriorityGoal(true);
    expect(result).toBe(goalList.eat);
  });

  test('returns highest priority of all goals if excludeSuspended is false', () => {
    goalManager.goals = {
      [goalList.sleep]: {
        name: goalList.sleep,
        getIsSuspended: jest.fn().mockReturnValue(true),
        getPriority: jest.fn().mockReturnValue(1),
      },
      [goalList.eat]: {
        name: goalList.eat,
        getIsSuspended: jest.fn().mockReturnValue(false),
        getPriority: jest.fn().mockReturnValue(2),
      },
      [goalList.wander]: {
        name: goalList.wander,
        getIsSuspended: jest.fn().mockReturnValue(false),
        getPriority: jest.fn().mockReturnValue(3),
      },
    };

    const result = goalManager.getTopPriorityGoal();
    expect(result).toBe(goalList.sleep);
  });

  test('returns first of highest priority goals if tied', () => {
    goalManager.goals = {
      [goalList.sleep]: {
        name: goalList.sleep,
        getIsSuspended: jest.fn().mockReturnValue(false),
        getPriority: jest.fn().mockReturnValue(1),
      },
      [goalList.eat]: {
        name: goalList.eat,
        getIsSuspended: jest.fn().mockReturnValue(false),
        getPriority: jest.fn().mockReturnValue(1),
      },
    };

    const result = goalManager.getTopPriorityGoal();
    expect(result).toBe(goalList.sleep);
  });
});
