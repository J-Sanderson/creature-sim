/**
 * @jest-environment jsdom
 */

import { goalList } from '../../../src/defaults';
import { GoalManager } from '../../../src/managers/GoalManager';

describe('addGoal', () => {
  const mockGoal = () =>
    jest.fn().mockImplementation(function (params) {
      this.params = params;
    });

  let creature;
  beforeEach(() => {
    jest.clearAllMocks();
    creature = {
      goals: {
        [goalList.sleep]: mockGoal(goalList.sleep),
        [goalList.eat]: mockGoal(goalList.eat),
        [goalList.wander]: mockGoal(goalList.wander),
      },
    };
    creature.goalManager = new GoalManager();
  });

  test('displays error if creature does not have goal', () => {
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    const goal = 'not-a-goal';

    creature.goalManager.addGoal(creature, goal, {});
    expect(err).toHaveBeenCalledWith(`Error: no goal object found for ${goal}`);
  });

  test('does not add goal if creature does not have goal', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const goal = 'not-a-goal';

    creature.goalManager.addGoal(creature, goal, {});
    expect(Object.keys(creature.goalManager.goals)).toHaveLength(0);
  });

  test('does not add goal if goalManager already has goal', () => {
    const goal = goalList.sleep;
    creature.goalManager.addGoal(creature, goal, {});
    creature.goalManager.addGoal(creature, goal, {});

    expect(creature.goals[goal]).toHaveBeenCalledTimes(1);
    expect(Object.keys(creature.goalManager.goals)).toHaveLength(1);
  });

  test('sets current goal name if isCurrent is true', () => {
    const goal = goalList.sleep;

    creature.goalManager.addGoal(creature, goal, {}, true);
    expect(creature.goalManager.currentGoalName).toBe(goal);
  });

  test('does not set current goal name if isCurrent is false', () => {
    const goal1 = goalList.sleep;
    const goal2 = goalList.eat;

    creature.goalManager.addGoal(creature, goal1, {}, true);
    creature.goalManager.addGoal(creature, goal2, {}, false);

    expect(creature.goalManager.currentGoalName).toBe(goal1);
    expect(creature.goalManager.goals).toHaveProperty(goal2);
  });

  test('adds goal if valid and not already present', () => {
    const goal = goalList.sleep;
    creature.goalManager.addGoal(creature, goal, {});
    expect(creature.goalManager.goals).toHaveProperty(goal);
  });

  test('goal constructor is called with params', () => {
    const goal = goalList.sleep;
    const params = { ticks: 5 };

    creature.goalManager.addGoal(creature, goal, params);
    expect(creature.goals[goal]).toHaveBeenCalledWith(params);
  });
});
