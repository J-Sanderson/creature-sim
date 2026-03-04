/**
 * @jest-environment jsdom
 */

import Goal from '../../../../src/state_machine/goals/Goal';

describe('decrementTicks', () => {
  let goal;
  beforeEach(() => {
    jest.clearAllMocks();
    goal = new Goal({});
  });
  afterEach(() => jest.restoreAllMocks());

  test('gets decay threshold', () => {
    const getDecayThreshold = jest
      .spyOn(goal, 'getDecayThreshold')
      .mockReturnValue(1);
    goal.decrementTicks();
    expect(getDecayThreshold).toHaveBeenCalledTimes(1);
  });

  test('gets ticks', () => {
    const getTicks = jest.spyOn(goal, 'getTicks').mockReturnValue(1);
    goal.decrementTicks();
    expect(getTicks).toHaveBeenCalledTimes(1);
  });

  test('does not decrement ticks if current tick value is 0', () => {
    const setTicks = jest.spyOn(goal, 'setTicks');
    jest.spyOn(goal, 'getTicks').mockReturnValue(0);

    goal.decrementTicks();
    expect(setTicks).toHaveBeenCalledTimes(0);
  });

  test('decrements ticks if current tick value is greater than 0 and decay threshold is 1', () => {
    const ticks = 1;
    const setTicks = jest.spyOn(goal, 'setTicks');
    jest.spyOn(goal, 'getTicks').mockReturnValue(ticks);
    jest.spyOn(goal, 'getDecayThreshold').mockReturnValue(1);

    goal.decrementTicks();
    expect(setTicks).toHaveBeenCalledTimes(1);
    expect(setTicks).toHaveBeenCalledWith(ticks - 1);
  });

  test('does not decrement ticks if current tick value is greater than 0, decay threshold is less than 1, and random roll is above threshold', () => {
    const setTicks = jest.spyOn(goal, 'setTicks');
    jest.spyOn(goal, 'getTicks').mockReturnValue(1);
    jest.spyOn(goal, 'getDecayThreshold').mockReturnValue(0.5);
    jest.spyOn(Math, 'random').mockReturnValue(1);

    goal.decrementTicks();
    expect(setTicks).toHaveBeenCalledTimes(0);
  });

  test('decrements ticks if current tick value is greater than 0, decay threshold is less than 1, and random roll is equal to threshold', () => {
    const ticks = 1;
    const setTicks = jest.spyOn(goal, 'setTicks');
    jest.spyOn(goal, 'getTicks').mockReturnValue(1);
    jest.spyOn(goal, 'getDecayThreshold').mockReturnValue(0.5);
    jest.spyOn(Math, 'random').mockReturnValue(0.5);

    goal.decrementTicks();
    expect(setTicks).toHaveBeenCalledTimes(1);
    expect(setTicks).toHaveBeenCalledWith(ticks - 1);
  });

  test('decrements ticks if current tick value is greater than 0, decay threshold is less than 1, and random roll is below threshold', () => {
    const ticks = 1;
    const setTicks = jest.spyOn(goal, 'setTicks');
    jest.spyOn(goal, 'getTicks').mockReturnValue(1);
    jest.spyOn(goal, 'getDecayThreshold').mockReturnValue(0.5);
    jest.spyOn(Math, 'random').mockReturnValue(0);

    goal.decrementTicks();
    expect(setTicks).toHaveBeenCalledTimes(1);
    expect(setTicks).toHaveBeenCalledWith(ticks - 1);
  });
});
