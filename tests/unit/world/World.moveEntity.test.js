/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';
import { World } from '../../../src/world/World';
beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(World.prototype, 'init').mockImplementation(function () {});
});
afterEach(() => jest.restoreAllMocks());

describe('moveEntity', () => {
  test('displays error if icon is not a HTML div element', () => {
    const error = jest
      .spyOn(console, 'error')
      .mockImplementation(function () {});
    const el = document.createElement('div');
    const world = new World(el);
    world.moveEntity('not an element', { x: 0, y: 0 });

    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith('Error: invalid icon element');
  });

  test('displays error and does not set position if icon does not have the entity class', () => {
    const error = jest
      .spyOn(console, 'error')
      .mockImplementation(function () {});
    const el = document.createElement('div');
    const world = new World(el);
    const icon = document.createElement('div');
    world.moveEntity(icon, { x: 5, y: 6 });

    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith('Error: invalid icon element');
    expect(icon.style.left).toBe('');
    expect(icon.style.top).toBe('');
  });

  test('correctly sets icon left and top values if icon is valid', () => {
    const x = 5;
    const y = 6;
    const cellSize = 10;
    const lineWidth = 1;
    const el = document.createElement('div');
    const world = new World(el, { cellSize, lineWidth });
    const icon = document.createElement('div');
    icon.classList.add('entity');
    world.moveEntity(icon, { x, y });

    expect(icon.style.left).toBe(
      `${x * world.params.cellSize + world.params.lineWidth}px`
    );
    expect(icon.style.top).toBe(
      `${y * world.params.cellSize + world.params.lineWidth}px`
    );
  });
});
