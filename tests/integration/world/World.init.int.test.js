/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';
import { World } from '../../../src/world/World';
import items from '../../../src/entities/items';
import Water from '../../../src/entities/items/Water';
import Creature from '../../../src/entities/Creature';

beforeEach(() => {
  jest.spyOn(World.prototype, 'tick').mockImplementation(() => {});
  jest.clearAllMocks();
});
afterEach(() => jest.restoreAllMocks());

describe('init', () => {
  test('creates canvas elements of correct type', () => {
    const el = document.createElement('div');
    const world = new World(el);

    expect(world.getElement('canvasWrapper')).toBeInstanceOf(HTMLDivElement);
    expect(world.getElement('canvas')).toBeInstanceOf(HTMLCanvasElement);
  });

  test('sets world.ctx to canvas context', () => {
    const el = document.createElement('div');
    const world = new World(el);

    expect(world.ctx).toBeInstanceOf(CanvasRenderingContext2D);
  });

  test('sets toybox to div element', () => {
    const el = document.createElement('div');
    const world = new World(el);

    expect(world.getElement('toybox')).toBeInstanceOf(HTMLDivElement);
  });

  test('sets toybox buttons to button elements', () => {
    const el = document.createElement('div');
    const world = new World(el);

    const toybox = world.getElement('toybox');
    items.forEach((item) => {
      const button = toybox.querySelector(`#btn-${item.className}`);
      expect(button).toBeInstanceOf(HTMLButtonElement);
    });
  });

  test('clicking toybox button adds item to entities', () => {
    const el = document.createElement('div');
    const world = new World(el);

    world.entities.items.clear();
    const toybox = world.getElement('toybox');
    const btn = toybox.querySelector('#btn-Water');
    btn.click();

    const items = world.getItems();
    expect(items.values().next().value).toBeInstanceOf(Water);
  });

  test('clicking toybox button sets button class and dataset', () => {
    const el = document.createElement('div');
    const world = new World(el);

    world.entities.items.clear();
    const toybox = world.getElement('toybox');
    const btn = toybox.querySelector('#btn-Water');
    btn.click();

    const items = world.getItems();
    const item = items.values().next().value;
    expect(Array.from(btn.classList)).toContain('item-active');
    expect(btn.dataset.entityId).toBe(item.getGUID());
  });

  test('adds a single creature', () => {
    const el = document.createElement('div');
    const world = new World(el);

    const creatures = world.getCreatures();
    expect(creatures.values().next().value).toBeInstanceOf(Creature);
  });
});
