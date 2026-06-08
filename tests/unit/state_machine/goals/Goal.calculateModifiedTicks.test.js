/**
 * @jest-environment jsdom
 */

import Goal from '../../../../src/state_machine/goals/Goal';

describe('calculateModifiedTicks', () => {
  let goal;
  beforeEach(() => {
    jest.clearAllMocks();
    goal = new Goal();
  });
  afterEach(() => jest.restoreAllMocks());

  test('displays error and returns 0 if personality value is not a number', () => {
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    const modifiedTicks = goal.calculateModifiedTicks('50', 100, 5);
    expect(err).toHaveBeenCalledWith(
      'Error: could not find personality value or max motive value'
    );
    expect(modifiedTicks).toBe(0);
  });

  test('displays error and returns 0 if maxMotive is not defined', () => {
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    const modifiedTicks = goal.calculateModifiedTicks(50, undefined, 5);
    expect(err).toHaveBeenCalledWith(
      'Error: could not find personality value or max motive value'
    );
    expect(modifiedTicks).toBe(0);
  });

  test('returns correctly modified ticks for given personality value', () => {
    const modifiedTicks = [
      goal.calculateModifiedTicks(10, 100, 5),
      goal.calculateModifiedTicks(50, 100, 5),
      goal.calculateModifiedTicks(90, 100, 5),
    ];
    expect(modifiedTicks).toEqual([5, 6, 7]);
  });

  test('returns correctly modified ticks for given personality value if value=false', () => {
    const modifiedTicks = [
      goal.calculateModifiedTicks(10, 100, 5, false),
      goal.calculateModifiedTicks(50, 100, 5, false),
      goal.calculateModifiedTicks(90, 100, 5, false),
    ];
    expect(modifiedTicks).toEqual([7, 6, 5]);
  });
});
