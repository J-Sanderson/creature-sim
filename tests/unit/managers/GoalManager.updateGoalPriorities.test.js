/**
 * @jest-environment jsdom
 */

import { GoalManager } from '../../../src/managers/GoalManager';
import { goalList } from '../../../src/defaults';

describe('updateGoalPriorities', () => {
  let creature, goalManager;
  beforeEach(() => {
    jest.clearAllMocks();
    creature = {};
    goalManager = new GoalManager();
    goalManager.goals = {
      [goalList.sleep]: {
        name: goalList.sleep,
        filter: jest.fn(),
        setPriority: jest.fn(),
      },
      [goalList.eat]: {
        name: goalList.eat,
        filter: jest.fn(),
        setPriority: jest.fn(),
      },
    };
  });
  afterEach(() => jest.restoreAllMocks());

  test('runs filter functions for each goal', () => {
    goalManager.updateGoalPriorities(creature);
    for (let goal in goalManager.goals) {
      expect(goalManager.goals[goal].filter).toHaveBeenCalledWith(creature);
      expect(goalManager.goals[goal].filter).toHaveBeenCalledTimes(1);
    }
  });

  test('deletes goal from list if priority is less than zero', () => {
    goalManager.goals[goalList.sleep].filter = jest.fn().mockReturnValue(-1);
    goalManager.goals[goalList.eat].filter = jest.fn().mockReturnValue(1);

    goalManager.updateGoalPriorities(creature);
    expect(goalManager.goals).not.toHaveProperty(goalList.sleep);
    expect(goalManager.goals).toHaveProperty(goalList.eat);
  });

  test('runs setPriority for goal if priority is not less than zero', () => {
    goalManager.goals[goalList.sleep].filter = jest.fn().mockReturnValue(-1);
    goalManager.goals[goalList.eat].filter = jest.fn().mockReturnValue(1);

    goalManager.updateGoalPriorities(creature);
    expect(goalManager.goals[goalList.eat].setPriority).toHaveBeenCalledWith(1);
    expect(goalManager.goals[goalList.eat].setPriority).toHaveBeenCalledTimes(
      1
    );
  });
});
