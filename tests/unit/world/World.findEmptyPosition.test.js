/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';
import { World } from '../../../src/world/World';
import { utilities } from '../../../src/utils/Utilities';

const positionableItem = (x, y) => {
  return {
    getPosition: jest.fn(() => ({ x, y })),
  };
};

describe('findEmptyPosition', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(World.prototype, 'init').mockImplementation(function () {});
  });
  afterEach(() => jest.restoreAllMocks());

  test('displays error and returns null if no free spaces', () => {
    const items = new Map();
    items.set('item-1', positionableItem(0, 0));
    items.set('item-2', positionableItem(0, 1));
    const getItems = jest
      .spyOn(World.prototype, 'getItems')
      .mockReturnValue(items);
    const error = jest
      .spyOn(console, 'error')
      .mockImplementation(function () {});
    const el = document.createElement('div');
    const world = new World(el, { width: 1, height: 2 });
    const attempts = 10;
    const pos = world.findEmptyPosition(attempts);

    expect(getItems).toHaveBeenCalledTimes(1);
    items.forEach((item) => {
      expect(item.getPosition).toHaveBeenCalledTimes(attempts);
    });
    expect(pos).toBeNull();
    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith('Error: no free space found');
  });

  test('displays error and returns null if no free spaces found after max attempts', () => {
    const items = new Map();
    items.set('item-1', positionableItem(0, 0));
    const getItems = jest
      .spyOn(World.prototype, 'getItems')
      .mockReturnValue(items);
    const error = jest
      .spyOn(console, 'error')
      .mockImplementation(function () {});
    jest.spyOn(utilities, 'rand').mockReturnValue(0);
    const el = document.createElement('div');
    const world = new World(el, { width: 1, height: 2 });
    const attempts = 10;
    const pos = world.findEmptyPosition(attempts);

    expect(getItems).toHaveBeenCalledTimes(1);
    expect(items.get('item-1').getPosition).toHaveBeenCalledTimes(attempts);
    expect(pos).toBeNull();
    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith('Error: no free space found');
  });

  test('returns position object if space found', () => {
    const items = new Map();
    items.set('item-1', positionableItem(0, 0));
    const getItems = jest
      .spyOn(World.prototype, 'getItems')
      .mockReturnValue(items);
    jest
      .spyOn(utilities, 'rand')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(1);
    const el = document.createElement('div');
    const world = new World(el, { width: 1, height: 2 });
    const pos = world.findEmptyPosition();

    expect(getItems).toHaveBeenCalledTimes(1);
    expect(items.get('item-1').getPosition).toHaveBeenCalledTimes(2);
    expect(pos).toEqual({ xPos: 0, yPos: 1 });
  });
});
