/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';
import { World } from '../../../src/world/World';

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(World.prototype, 'tick').mockImplementation(function () {});
});
afterEach(() => jest.restoreAllMocks());

describe('getters', () => {
  describe('getParam', () => {
    test('displays error if param is not valid', () => {
      const error = jest
        .spyOn(console, 'error')
        .mockImplementation(function () {});
      const param = 'notAParam';
      const el = document.createElement('div');
      const world = new World(el);
      const guid = world.getGUID();

      const result = world.getParam(param);
      expect(error).toHaveBeenCalledTimes(1);
      expect(error).toHaveBeenCalledWith(
        `Error: world ${guid} has no parameter ${param}`
      );
      expect(result).toBeUndefined();
    });

    test('returns param if exists', () => {
      const cellSize = 10;
      const el = document.createElement('div');
      const world = new World(el, { cellSize });

      const result = world.getParam('cellSize');
      expect(result).toBe(cellSize);
    });
  });

  describe('getElement', () => {
    test('displays error if element is not valid', () => {
      const error = jest
        .spyOn(console, 'error')
        .mockImplementation(function () {});
      const elName = 'notAnElement';
      const el = document.createElement('div');
      const world = new World(el);
      const guid = world.getGUID();

      const result = world.getElement(elName);
      expect(error).toHaveBeenCalledTimes(1);
      expect(error).toHaveBeenCalledWith(
        `Error: world ${guid} has no element ${elName}`
      );
      expect(result).toBeUndefined();
    });

    test('returns element if exists', () => {
      const elName = 'root';
      const el = document.createElement('div');
      const world = new World(el);

      const result = world.getElement(elName);
      expect(result).toBe(el);
      expect(result).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('getGUID', () => {
    test('returns world guid', () => {
      const id = 'world-1';
      const el = document.createElement('div');
      const world = new World(el);
      world.guid = id;

      const result = world.getGUID();
      expect(result).toBe(id);
    });
  });

  describe('getEntities', () => {
    test('returns object with creatures and items', () => {
      const el = document.createElement('div');
      const world = new World(el);

      const result = world.getEntities();
      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('creatures');
      expect(result).toHaveProperty('items');
      expect(result).not.toHaveProperty('notAnEntityType');
    });

    test('returns creatures and items as maps', () => {
      const el = document.createElement('div');
      const world = new World(el);

      const result = world.getEntities();
      expect(result.creatures).toBeInstanceOf(Map);
      expect(result.items).toBeInstanceOf(Map);
    });
  });

  describe('getItems', () => {
    test('returns map', () => {
      const el = document.createElement('div');
      const world = new World(el);

      const result = world.getItems();
      expect(result).toBeInstanceOf(Map);
    });

    test('returns same map as getEntities', () => {
      const el = document.createElement('div');
      const world = new World(el);

      const entities = world.getEntities();
      const result = world.getItems();
      expect(result).toBe(entities.items);
    });
  });

  describe('getItem', () => {
    test('returns undefined if item does not exist', () => {
      const id = 'notAnItem';
      const el = document.createElement('div');
      const world = new World(el);
      world.entities.items.clear();

      const result = world.getItem(id);
      expect(result).toBeUndefined();
    });

    test('returns item if it exists', () => {
      const id1 = 'item-1';
      const item1 = { id1 };
      const id2 = 'item-2';
      const item2 = { id2 };
      const el = document.createElement('div');
      const world = new World(el);
      world.entities.items.clear();
      world.entities.items.set(id1, item1);
      world.entities.items.set(id2, item2);

      const result = world.getItem(id1);
      expect(result).toBe(item1);
      expect(result).not.toBe(item2);
    });
  });

  describe('getCreatures', () => {
    test('returns map', () => {
      const el = document.createElement('div');
      const world = new World(el);

      const result = world.getCreatures();
      expect(result).toBeInstanceOf(Map);
    });

    test('returns same map as getEntities', () => {
      const el = document.createElement('div');
      const world = new World(el);

      const entities = world.getEntities();
      const result = world.getCreatures();
      expect(result).toBe(entities.creatures);
    });
  });

  describe('getCreature', () => {
    test('returns undefined if creature does not exist', () => {
      const id = 'notACreature';
      const el = document.createElement('div');
      const world = new World(el);
      world.entities.creatures.clear();

      const result = world.getCreature(id);
      expect(result).toBeUndefined();
    });

    test('returns creature if it exists', () => {
      const id1 = 'creature-1';
      const creature1 = { id1 };
      const id2 = 'creature-2';
      const creature2 = { id2 };
      const el = document.createElement('div');
      const world = new World(el);
      world.entities.creatures.clear();
      world.entities.creatures.set(id1, creature1);
      world.entities.creatures.set(id2, creature2);

      const result = world.getCreature(id1);
      expect(result).toBe(creature1);
      expect(result).not.toBe(creature2);
    });
  });

  describe('getBounds', () => {
    test('returns object with x and y properties', () => {
      const el = document.createElement('div');
      const world = new World(el);

      const result = world.getBounds();
      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('x');
      expect(result).toHaveProperty('y');
      expect(result).not.toHaveProperty('z');
    });

    test('returns bounds for given x and y params', () => {
      const x = 5;
      const y = 6;
      const el = document.createElement('div');
      const world = new World(el, { width: x, height: y });

      const result = world.getBounds();
      expect(result.x).toBe(x);
      expect(result.y).toBe(y);
    });
  });
});
