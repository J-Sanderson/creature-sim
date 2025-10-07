/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';
import { World } from '../../../src/world/World';
import worldManager from '../../../src/managers/WorldManager';
import { DebugManager } from '../../../src/managers/DebugManager';

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

    expect(world).toBeInstanceOf(World);
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
    expect(world.params).not.toBe(World.defaults);
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

    expect(world.elements.root).toEqual(el);
    expect(world.elements.root).toBeInstanceOf(HTMLElement);
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
    jest.spyOn(World.prototype, 'init').mockImplementation(() => {});
    const el = document.createElement('div');
    const world = new World(el);
    const guid = world.guid;

    expect(typeof guid).toBe('string');
    expect(guid).toMatch(
      /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i
    );
    expect(worldManager.addWorld).toHaveBeenCalledWith(guid, world);
  });

  test('sets debug manager', () => {
    jest.spyOn(World.prototype, 'init').mockImplementation(() => {});
    const el = document.createElement('div');
    const world = new World(el);

    expect(DebugManager).toHaveBeenCalledTimes(1);
    expect(world.debugManager).toBeInstanceOf(DebugManager);
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
