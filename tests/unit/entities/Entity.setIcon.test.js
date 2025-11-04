/**
 * @jest-environment jsdom
 */
const cellSize = 10;
jest.mock('../../../src/world/World', () => {
  const MockWorld = class World {
    constructor() {
      this.params = { maxMotive: 100, lineWidth: 1, cellSize };
    }
    getParam(param) {
      return this.params[param];
    }
    displayEntity() {
      return jest.fn();
    }
    getBounds() {
      return {x: 5, y: 5}
    }
  };
  return { __esModule: true, World: MockWorld };
});

import { World as MockWorld } from '../../../src/world/World';
import Entity from '../../../src/entities/Entity';
import worldManager from '../../../src/managers/WorldManager';

describe('setIcon', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('sets span as first child of icon element', () => {
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    const entity = new Entity('w-1');
    entity.setIcon();

    expect(entity.outputs.icon.children).toHaveLength(1);
    expect(entity.outputs.icon.querySelector('span')).not.toBeNull();
  });

  test('sets default icon if none present in entity defaults', () => {
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    const entity = new Entity('w-1');
    entity.setIcon();
    const span = entity.outputs.icon.querySelector('span');

    expect(
      `&#x${span.innerHTML.codePointAt(0).toString(16).toUpperCase()};`
    ).toBe('&#x2753;');
  });

  test('sets icon if present in entity defaults', () => {
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    const entity = new Entity('w-1');
    const icon = '&#x1F415;';
    entity.icon = icon;
    entity.setIcon();
    const span = entity.outputs.icon.querySelector('span');

    expect(
      `&#x${span.innerHTML.codePointAt(0).toString(16).toUpperCase()};`
    ).toBe(icon);
  });

  test('sets icon font size to cell size', () => {
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    const entity = new Entity('w-1');
    entity.setIcon();

    expect(entity.outputs.icon.style['font-size']).toBe(`${cellSize}px`);
  });

  test('sets icon z index to entity order', () => {
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    const entity = new Entity('w-1');
    const order = 2;
    entity.order = order;
    entity.setIcon();

    expect(entity.outputs.icon.style['z-index']).toBe(`${order}`);
  });
});
