/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';
import { World } from '../../../src/world/World';
import { utilities } from '../../../src/utils/Utilities';
import Water from '../../../src/entities/items/Water';

describe('findEmptyPosition', () => {
  test('returns null if no free spaces', () => {
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    const el = document.createElement('div');
    const world = new World(el, { width: 1, height: 2 });
    world.addEntity(Water, { xPos: 0, yPos: 0 });
    world.addEntity(Water, { xPos: 0, yPos: 1 });

    const attempts = 10;
    const pos = world.findEmptyPosition(attempts);
    expect(pos).toBeNull();
    expect(err).toHaveBeenCalledWith('Error: no free space found');
  });

  test('returns null if no free spaces found after max attempts', () => {
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    const el = document.createElement('div');
    const world = new World(el, { width: 1, height: 2 });
    world.addEntity(Water, { xPos: 0, yPos: 0 });
    jest.spyOn(utilities, 'rand').mockReturnValue(0);

    const attempts = 10;
    const pos = world.findEmptyPosition(attempts);
    expect(pos).toBeNull();
    expect(err).toHaveBeenCalledWith('Error: no free space found');
  });

  test('returns position object if space found', () => {
    const el = document.createElement('div');
    const world = new World(el, { width: 1, height: 2 });
    world.addEntity(Water, { xPos: 0, yPos: 0 });
    jest
      .spyOn(utilities, 'rand')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(1);

    const pos = world.findEmptyPosition();
    expect(pos).toEqual({ xPos: 0, yPos: 1 });
  });
});
