/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';
import { World } from '../../../src/world/World';
import worldManager from '../../../src/managers/WorldManager';
import { DebugManager } from '../../../src/managers/DebugManager';

describe('constructor', () => {
  beforeEach(() => jest.clearAllMocks());
  afterEach(() => jest.restoreAllMocks());

  test('root is html element', () => {
    const el = document.createElement('div');
    const world = new World(el);

    expect(world.getElement('root')).toBeInstanceOf(HTMLDivElement);
  });

  test('creates entity maps', () => {
    const el = document.createElement('div');
    const world = new World(el);

    expect(world.getItems()).toBeInstanceOf(Map);
    expect(world.getCreatures()).toBeInstanceOf(Map);
  });

  test('adds world to world manager', () => {
    const el = document.createElement('div');
    const world = new World(el);
    const id = world.getGUID();

    expect(worldManager.getWorld(id)).toBe(world);
  });

  test('creates unique worlds', () => {
    const el1 = document.createElement('div');
    const world1 = new World(el1);
    const id1 = world1.getGUID();
    const el2 = document.createElement('div');
    const world2 = new World(el2);
    const id2 = world2.getGUID();

    expect(id1).not.toBe(id2);
    expect(worldManager.getWorld(id1)).toBe(world1);
    expect(worldManager.getWorld(id2)).toBe(world2);
  });

  test('creates DebugManager', () => {
    const el = document.createElement('div');
    const world = new World(el);

    expect(world.debugManager).toBeInstanceOf(DebugManager);
  });
});
