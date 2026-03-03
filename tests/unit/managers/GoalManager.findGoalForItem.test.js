/**
 * @jest-environment jsdom
 */

import { GoalManager } from '../../../src/managers/GoalManager';
import { utilities } from '../../../src/utils/Utilities';
import { itemBuilder } from '../../helpers/itemBuilder';
import { creatureBuilder } from '../../helpers/creatureBuilder';
import {
  adjectiveList,
  goalList,
  personalityValueList,
} from '../../../src/defaults';

describe('findGoalForItem', () => {
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

  test('does not add a goal if none associated with item adjectives', () => {
    const item = itemBuilder({
      properties: { adjectives: [adjectiveList.restful] },
    });

    creature.goalManager.findGoalForItem(creature, item);
    expect(addGoal).toHaveBeenCalledTimes(0);
  });

  test('does not add a goal if no candidates have valid priorities', () => {
    creature.goals = {
      [goalList.chewToy]: mockGoal(-1),
      [goalList.bounceToy]: mockGoal(-1),
      [goalList.cuddleToy]: mockGoal(-1),
    };
    const item = itemBuilder({
      properties: {
        adjectives: [
          adjectiveList.chew,
          adjectiveList.bounce,
          adjectiveList.soft,
        ],
      },
    });
    creature.goalManager.findGoalForItem(creature, item);
    expect(addGoal).toHaveBeenCalledTimes(0);
  });

  test('chooses first candidate goal if random roll is below threshold', () => {
    jest.spyOn(utilities, 'rand').mockReturnValue(0);
    creature.goals = {
      [goalList.chewToy]: mockGoal(1),
      [goalList.bounceToy]: mockGoal(2),
      [goalList.cuddleToy]: mockGoal(3),
    };
    const item = itemBuilder({
      properties: {
        adjectives: [
          adjectiveList.chew,
          adjectiveList.bounce,
          adjectiveList.soft,
        ],
      },
    });

    creature.goalManager.findGoalForItem(creature, item);
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
      [goalList.chewToy]: mockGoal(1),
      [goalList.bounceToy]: mockGoal(2),
      [goalList.cuddleToy]: mockGoal(3),
    };
    const item = itemBuilder({
      properties: {
        adjectives: [
          adjectiveList.chew,
          adjectiveList.bounce,
          adjectiveList.soft,
        ],
      },
    });

    creature.goalManager.findGoalForItem(creature, item);
    expect(creature.goalManager.addGoal).toHaveBeenCalledWith(
      creature,
      goalList.bounceToy,
      expect.objectContaining({ ticks: 5 })
    );
  });

  test('chooses final candidate goal if all random rolls are threshold', () => {
    jest.spyOn(utilities, 'rand').mockReturnValue(1);
    creature.goals = {
      [goalList.chewToy]: mockGoal(1),
      [goalList.bounceToy]: mockGoal(2),
      [goalList.cuddleToy]: mockGoal(3),
    };
    const item = itemBuilder({
      properties: {
        adjectives: [
          adjectiveList.chew,
          adjectiveList.bounce,
          adjectiveList.soft,
        ],
      },
    });

    creature.goalManager.findGoalForItem(creature, item);
    expect(creature.goalManager.addGoal).toHaveBeenCalledWith(
      creature,
      goalList.cuddleToy,
      expect.objectContaining({ ticks: 5 })
    );
  });
});
