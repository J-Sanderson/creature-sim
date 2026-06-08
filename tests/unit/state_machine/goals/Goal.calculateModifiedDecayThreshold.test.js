/**
 * @jest-environment jsdom
 */

import Goal from '../../../../src/state_machine/goals/Goal';

describe('calculateModifiedDecayThreshold', () => {
  let goal;
  beforeEach(() => {
    jest.clearAllMocks();
    goal = new Goal();
  });
  afterEach(() => jest.restoreAllMocks());

  test('displays error and returns 1 if personality value is not defined', () => {
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    const modifiedThreshold = goal.calculateModifiedDecayThreshold(
      undefined,
      100,
      1
    );
    expect(err).toHaveBeenCalledWith(
      'Error: could not find personality value or max motive value'
    );
    expect(modifiedThreshold).toBe(1);
  });

  test('displays error and returns 1 if maxMotive is not defined', () => {
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    const modifiedThreshold = goal.calculateModifiedDecayThreshold(
      50,
      undefined,
      1
    );
    expect(err).toHaveBeenCalledWith(
      'Error: could not find personality value or max motive value'
    );
    expect(modifiedThreshold).toBe(1);
  });

  test('returns correctly modified threshold for given personality value', () => {
    const modifiedThresholds = [
      goal.calculateModifiedDecayThreshold(10, 100, 1),
      goal.calculateModifiedDecayThreshold(50, 100, 1),
      goal.calculateModifiedDecayThreshold(90, 100, 1),
    ];
    expect(modifiedThresholds).toEqual([0.9, 0.5, 0.4]);
  });

  test('returns correctly modified threshold for given personality value if positive=false', () => {
    const modifiedThresholds = [
      goal.calculateModifiedDecayThreshold(10, 100, 1, false),
      goal.calculateModifiedDecayThreshold(50, 100, 1, false),
      goal.calculateModifiedDecayThreshold(90, 100, 1, false),
    ];
    expect(modifiedThresholds).toEqual([0.4, 0.5, 0.9]);
  });
});
