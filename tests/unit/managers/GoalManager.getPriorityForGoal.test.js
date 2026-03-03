/**
 * @jest-environment jsdom
 */

import { GoalManager } from '../../../src/managers/GoalManager';
import { goalList } from '../../../src/defaults';

describe('getPriorityForGoal', () => {
  let creature, goalManager;
  beforeEach(() => {
    jest.clearAllMocks();
    creature = {
      goals: {
        [goalList.sleep]: class {
          name = goalList.sleep;
          filter = jest.fn();
        },
        [goalList.eat]: class {
          name = goalList.eat;
          filter = jest.fn().mockReturnValue(1);
        },
      },
    };
    goalManager = new GoalManager();
  });
  afterEach(() => jest.restoreAllMocks());

  test('displays error if goal does not exist', () => {
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    const goal = 'not-a-goal';

    goalManager.getPriorityForGoal(creature, goal);
    expect(err).toHaveBeenCalledWith(`Error: no goal object found for ${goal}`);
  });

  test('returns undefined if goal does not exist', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const goal = 'not-a-goal';

    const result = goalManager.getPriorityForGoal(creature, goal);
    expect(result).toBeUndefined();
  });

  test('returns goal priority if goal exists', () => {
    const goal = goalList.eat;

    const result = goalManager.getPriorityForGoal(creature, goal);
    expect(result).toBe(1);
  });
});
