/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';
import { World } from '../../../src/world/World';

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(World.prototype, 'init').mockImplementation(function () {
    const wrapper = document.createElement('div');
    this.elements = {
      root: document.createElement('div'),
      canvasWrapper: wrapper,
    };
  });
});
afterEach(() => jest.restoreAllMocks());

describe('displayEntity', () => {
  test('displays error if icon is not a HTML div element', () => {
    const error = jest
      .spyOn(console, 'error')
      .mockImplementation(function () {});
    const el = document.createElement('div');
    const world = new World(el);
    world.displayEntity('not an element');

    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith('Error: invalid icon element');
    expect(
      world.elements.canvasWrapper.querySelectorAll('.entity')
    ).toHaveLength(0);
  });

  test('displays error and does not add to world elements if icon does not have the entity class', () => {
    const error = jest
      .spyOn(console, 'error')
      .mockImplementation(function () {});
    const el = document.createElement('div');
    const world = new World(el);
    const icon = document.createElement('div');
    world.displayEntity(icon);

    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith('Error: invalid icon element');
    expect(
      world.elements.canvasWrapper.querySelectorAll('.entity')
    ).toHaveLength(0);
  });

  test('adds to world elements if icon has the entity class', () => {
    const el = document.createElement('div');
    const world = new World(el);
    const icon = document.createElement('div');
    icon.classList.add('entity');
    world.displayEntity(icon);

    const icons = world.elements.canvasWrapper.querySelectorAll('.entity');
    expect(icons).toHaveLength(1);
    expect(icons[0]).toBe(icon);
  });
});
