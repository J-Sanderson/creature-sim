/**
 * @jest-environment jsdom
 */

import Goal from '../../../../src/state_machine/goals/Goal';
import { creatureBuilder } from '../../../helpers/creatureBuilder';
import { emotionList } from '../../../../src/defaults';

describe('setEmotion', () => {
  let creature, goal, getMaxMotive;
  beforeEach(() => {
    jest.clearAllMocks();
    creature = creatureBuilder({
      id: 'c-1',
    });
    goal = new Goal();
    getMaxMotive = jest.spyOn(creature, 'getMaxMotive');
  });
  afterEach(() => jest.restoreAllMocks());

  test('displays error if params is missing name property', () => {
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    goal.setEmotion(creature, { value: 1 });
    expect(err).toHaveBeenCalledWith('Error: no valid emotion object');
    expect(getMaxMotive).toHaveBeenCalledTimes(0);
  });

  test('displays error if params is missing value property', () => {
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    goal.setEmotion(creature, { name: emotionList.happy });
    expect(err).toHaveBeenCalledWith('Error: no valid emotion object');
    expect(getMaxMotive).toHaveBeenCalledTimes(0);
  });

  test('displays error if params.name is not a valid emotion', () => {
    const emotion = 'not-an-emotion';
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    goal.setEmotion(creature, { name: emotion, value: 1 });
    expect(err).toHaveBeenCalledWith(
      `Error: ${emotion} is not a valid emotion`
    );
    expect(getMaxMotive).toHaveBeenCalledTimes(0);
  });

  test('runs creature.getMaxMotive', () => {
    goal.setEmotion(creature, { name: emotionList.happy, value: 1 });
    expect(getMaxMotive).toHaveBeenCalledTimes(1);
  });

  test('sets goal token emotion to maxMotive if passed value is greater than maxMotive', () => {
    const value = creature.getMaxMotive();
    goal.setEmotion(creature, { name: emotionList.happy, value: value + 1 });
    expect(goal.goalToken.emotions[emotionList.happy]).toBe(value);
  });

  test('sets goal token emotion to 0 if passed value is negative', () => {
    const value = 0;
    goal.setEmotion(creature, { name: emotionList.happy, value: value - 1 });
    expect(goal.goalToken.emotions[emotionList.happy]).toBe(value);
  });

  test('sets goal token emotion to value if passed value is between 0 and maxMotive', () => {
    const value = creature.getMaxMotive() - 1;
    goal.setEmotion(creature, { name: emotionList.happy, value });
    expect(goal.goalToken.emotions[emotionList.happy]).toBe(value);
  });
});
