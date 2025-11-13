/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';

import worldManager from '../../../src/managers/WorldManager';
import { World } from '../../../src/world/World';

describe('WorldManager', () => {
  beforeEach(() => {
    worldManager.worlds.clear();
  });

  describe('constructor', () => {
    test('creates worlds map', () => {
      expect(worldManager.worlds).toBeDefined();
      expect(worldManager.worlds).toBeInstanceOf(Map);
    });

    test('worlds map is empty by default', () => {
      expect(worldManager.worlds.size).toBe(0);
    });
  });

  describe('addWorld', () => {
    test('adds world to map', () => {
      const el = document.createElement('div');
      const world = new World(el);
      const id = world.getGUID();

      worldManager.addWorld();

      expect(worldManager.worlds.get(id)).toBe(world);
    });
  });

  describe('getWorld', () => {
    test('returns world where valid', () => {
      const el = document.createElement('div');
      const world = new World(el);
      const id = world.getGUID();

      worldManager.addWorld();
      const result = worldManager.getWorld(id);

      expect(result).toBe(world);
      expect(result).toBeInstanceOf(World);
    });

    test('returns undefined where given world does not exist', () => {
      const id = 'not-a-world';
      worldManager.getWorld(id);

      const result = worldManager.getWorld(id);
      expect(result).toBeUndefined();
    });
  });

  describe('removeWorld', () => {
    test('deletes given world', () => {
      const el = document.createElement('div');
      const world = new World(el);
      const id = world.getGUID();

      worldManager.addWorld();
      expect(worldManager.getWorld(id)).toBe(world);

      worldManager.removeWorld(id);
      expect(worldManager.getWorld(id)).toBeUndefined();
    });
  });
});
