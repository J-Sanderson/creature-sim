/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';
import { World } from '../../../src/world/World';
import worldManager from '../../../src/managers/WorldManager';
import { DebugManager } from '../../../src/managers/DebugManager';
import { utilities } from '../../../src/utils/Utilities';

jest.mock('../../../src/managers/WorldManager', () => ({
  __esModule: true,
  default: { addWorld: jest.fn() },
}));
jest.mock('../../../src/managers/DebugManager', () => {
  const DebugManager = jest.fn();
  return { __esModule: true, DebugManager };
});

describe('constructor', () => {
  beforeEach(() => jest.clearAllMocks());
  afterEach(() => jest.restoreAllMocks());

  test('fails if html element not passed to constructor', () => {
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    const init = jest
      .spyOn(World.prototype, 'init')
      .mockImplementation(() => {});
    const el = 'not an element';
    const world = new World(el);

    expect(world.params).toBeUndefined();
    expect(world.entities).toBeUndefined();
    expect(world.guid).toBeUndefined();
    expect(world.debugManager).toBeUndefined();
    expect(err).toHaveBeenCalledTimes(1);
    expect(err).toHaveBeenCalledWith(
      `Error: ${el} is not a valid HTML element`
    );
    expect(worldManager.addWorld).not.toHaveBeenCalled();
    expect(DebugManager).not.toHaveBeenCalled();
    expect(init).not.toHaveBeenCalled();
  });

  test('uses default params if not passed', () => {
    jest.spyOn(World.prototype, 'init').mockImplementation(() => {});
    const el = document.createElement('div');
    const world = new World(el);

    expect(world.params).toEqual(World.defaults);
  });

  test('uses passed params where relevant', () => {
    jest.spyOn(World.prototype, 'init').mockImplementation(() => {});
    const el = document.createElement('div');
    const speed = 500;
    const world = new World(el, { speed });

    for (let param in World.defaults) {
      if (param === 'speed') {
        expect(world.params.speed).toEqual(speed);
      } else {
        expect(world.params[param]).toEqual(World.defaults[param]);
      }
    }
  });

  test('sets root element', () => {
    jest.spyOn(World.prototype, 'init').mockImplementation(() => {});
    const el = document.createElement('div');
    const world = new World(el);

    expect(world.elements.root).toBe(el);
  });

  test('sets entity maps', () => {
    jest.spyOn(World.prototype, 'init').mockImplementation(() => {});
    const entities = {
      items: new Map(),
      creatures: new Map(),
    };
    const el = document.createElement('div');
    const world = new World(el);

    expect(world.entities).toEqual(entities);
  });

  test('creates guid and registers with worldManager', () => {
    const id = 'world-1';
    jest.spyOn(utilities, 'generateGUID').mockReturnValue(id);
    jest.spyOn(World.prototype, 'init').mockImplementation(() => {});
    const el = document.createElement('div');
    const world = new World(el);

    expect(typeof world.guid).toBe('string');
    expect(world.guid).toBe(id);
    expect(worldManager.addWorld).toHaveBeenCalledWith(world.guid, world);
  });

  test('sets debug manager', () => {
    jest.spyOn(World.prototype, 'init').mockImplementation(() => {});
    const el = document.createElement('div');
    new World(el);

    expect(DebugManager).toHaveBeenCalledTimes(1);
  });

  test('calls init', () => {
    const init = jest
      .spyOn(World.prototype, 'init')
      .mockImplementation(() => {});
    const el = document.createElement('div');
    new World(el);

    expect(init).toHaveBeenCalled();
  });
});
