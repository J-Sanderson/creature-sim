/**
 * @jest-environment jsdom
 */

import Goal from '../../../../src/state_machine/goals/Goal';
import { creatureBuilder } from '../../../helpers/creatureBuilder';
import { motiveList } from '../../../../src/defaults';

describe('setMotive', () => {
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
    goal.setMotive(creature, { value: 1 });
    expect(err).toHaveBeenCalledWith('Error: no valid motive object');
    expect(getMaxMotive).toHaveBeenCalledTimes(0);
  });

  test('displays error if params is missing value property', () => {
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    goal.setMotive(creature, { name: motiveList.energy });
    expect(err).toHaveBeenCalledWith('Error: no valid motive object');
    expect(getMaxMotive).toHaveBeenCalledTimes(0);
  });

  test('displays error if params.name is not a valid motive', () => {
    const motive = 'not-a-motive';
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    goal.setMotive(creature, { name: motive, value: 1 });
    expect(err).toHaveBeenCalledWith(`Error: ${motive} is not a valid motive`);
    expect(getMaxMotive).toHaveBeenCalledTimes(0);
  });

  test('runs creature.getMaxMotive', () => {
    goal.setMotive(creature, { name: motiveList.energy, value: 1 });
    expect(getMaxMotive).toHaveBeenCalledTimes(1);
  });

  test('sets goal token motive to maxMotive if passed value is greater than maxMotive', () => {
    const value = creature.getMaxMotive();
    goal.setMotive(creature, { name: motiveList.energy, value: value + 1 });
    expect(goal.goalToken.motives[motiveList.energy]).toBe(value);
  });

  test('sets goal token motive to 0 if passed value is negative', () => {
    const value = 0;
    goal.setMotive(creature, { name: motiveList.energy, value: value - 1 });
    expect(goal.goalToken.motives[motiveList.energy]).toBe(value);
  });

  test('sets goal token motive to value if passed value is between 0 and maxMotive', () => {
    const value = creature.getMaxMotive() - 1;
    goal.setMotive(creature, { name: motiveList.energy, value });
    expect(goal.goalToken.motives[motiveList.energy]).toBe(value);
  });
});
