/**
 * @jest-environment jsdom
 */

import { GoalManager } from '../../../src/managers/GoalManager';
import { utilities } from '../../../src/utils/Utilities';
import { goalList, personalityValueList } from '../../../src/defaults';
import { creatureBuilder } from '../../helpers/creatureBuilder';

describe('findInterestingGoals', () => {
  const mockGoal = (priority) =>
    class {
      filter = jest.fn(() => priority);
    };

  let creature, addGoal;
  beforeEach(() => {
    jest.clearAllMocks();
    creature = creatureBuilder({
      id: 'c-1',
      personalityByValue: {
        [personalityValueList.finickiness]: 50,
        [personalityValueList.independence]: 60,
        [personalityValueList.kindness]: 70,
      },
    });
    creature.goalManager = new GoalManager();
    addGoal = jest
      .spyOn(creature.goalManager, 'addGoal')
      .mockImplementation(() => {});
  });
  afterEach(() => jest.restoreAllMocks());

  test('adds goalWander if no other valid goals', () => {
    creature.goals = {
      [goalList.eat]: mockGoal(-1),
      [goalList.sleep]: mockGoal(-1),
      [goalList.chewToy]: mockGoal(-1),
      [goalList.bounceToy]: mockGoal(-1),
      [goalList.cuddleToy]: mockGoal(-1),
      [goalList.wander]: mockGoal(-1),
    };

    creature.goalManager.findInterestingGoals(creature);
    expect(creature.goalManager.addGoal).toHaveBeenCalledWith(
      creature,
      goalList.wander,
      expect.objectContaining({ ticks: 5 })
    );
  });

  test('chooses first candidate goal if random roll is below threshold', () => {
    jest.spyOn(utilities, 'rand').mockReturnValue(0);

    creature.goals = {
      [goalList.eat]: mockGoal(-1),
      [goalList.sleep]: mockGoal(-1),
      [goalList.chewToy]: mockGoal(1),
      [goalList.bounceToy]: mockGoal(2),
      [goalList.cuddleToy]: mockGoal(3),
      [goalList.wander]: mockGoal(-1),
    };

    creature.goalManager.findInterestingGoals(creature);
    expect(creature.goalManager.addGoal).toHaveBeenCalledWith(
      creature,
      goalList.chewToy,
      expect.objectContaining({ ticks: 5 })
    );
  });

  test('skips first candidate goal if first random roll is threshold', () => {
    jest.spyOn(utilities, 'rand').mockReturnValueOnce(1);
    jest.spyOn(utilities, 'rand').mockReturnValueOnce(0);

    creature.goals = {
      [goalList.eat]: mockGoal(-1),
      [goalList.sleep]: mockGoal(-1),
      [goalList.chewToy]: mockGoal(1),
      [goalList.bounceToy]: mockGoal(2),
      [goalList.cuddleToy]: mockGoal(3),
      [goalList.wander]: mockGoal(-1),
    };

    creature.goalManager.findInterestingGoals(creature);
    expect(creature.goalManager.addGoal).toHaveBeenCalledWith(
      creature,
      goalList.bounceToy,
      expect.objectContaining({ ticks: 5 })
    );
  });

  test('chooses final candidate goal if all random rolls are threshold', () => {
    jest.spyOn(utilities, 'rand').mockReturnValue(1);

    creature.goals = {
      [goalList.eat]: mockGoal(-1),
      [goalList.sleep]: mockGoal(-1),
      [goalList.chewToy]: mockGoal(1),
      [goalList.bounceToy]: mockGoal(2),
      [goalList.cuddleToy]: mockGoal(3),
      [goalList.wander]: mockGoal(-1),
    };

    creature.goalManager.findInterestingGoals(creature);
    expect(creature.goalManager.addGoal).toHaveBeenCalledWith(
      creature,
      goalList.cuddleToy,
      expect.objectContaining({ ticks: 5 })
    );
  });
});
