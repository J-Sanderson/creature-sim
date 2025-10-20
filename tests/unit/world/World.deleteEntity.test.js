/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';
import { World } from '../../../src/world/World';

function entityWithIcon() {
  let icon = document.createElement('div');
  icon.classList.add('entity');
  return { outputs: { icon } };
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(World.prototype, 'init').mockImplementation(function () {
    let toybox = document.createElement('div');
    this.elements.root.appendChild(toybox);
    this.elements.toybox = toybox;
  });
});
afterEach(() => jest.restoreAllMocks());

describe('deleteEntity', () => {
  test('displays error if entity type is not valid', () => {
    const error = jest
      .spyOn(console, 'error')
      .mockImplementation(function () {});
    const el = document.createElement('div');
    const world = new World(el);
    world.deleteEntity('entity-1', 'notAnEntityType');

    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith('Error: invalid entity type');
  });

  test('displays error if entity does not exist', () => {
    const error = jest
      .spyOn(console, 'error')
      .mockImplementation(function () {});
    const items = ['item-1', 'item-2'];
    const id = 'item-3';
    const el = document.createElement('div');
    const world = new World(el);
    items.forEach((item) => {
      world.entities.items.set(item, entityWithIcon());
    });

    world.deleteEntity(id);

    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith(
      `Error: no entity found for id ${id} in type items`
    );
  });

  test('displays error if entity does not exist in given type', () => {
    const error = jest
      .spyOn(console, 'error')
      .mockImplementation(function () {});
    const items = ['item-1', 'item-2'];
    const el = document.createElement('div');
    const world = new World(el);
    items.forEach((item) => {
      world.entities.items.set(item, entityWithIcon());
    });

    world.deleteEntity(items[0], 'creatures');

    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith(
      `Error: no entity found for id ${items[0]} in type creatures`
    );
  });

  test('clears associated button if present', () => {
    const items = ['item-1', 'item-2'];
    const activeClass = 'item-active';
    const el = document.createElement('div');
    const world = new World(el);

    items.forEach((item) => {
      let button = document.createElement('button');
      button.dataset.entityId = item;
      button.classList.add(activeClass);
      world.elements.toybox.appendChild(button);

      world.entities.items.set(item, entityWithIcon());
    });

    const buttons = world.elements.toybox.querySelectorAll('button');
    world.deleteEntity(items[0]);
    expect(buttons[0].dataset.entityId).toBeUndefined();
    expect(buttons[0].classList.contains(activeClass)).toBe(false);
    expect(buttons[1].dataset.entityId).toBe(items[1]);
    expect(buttons[1].classList.contains(activeClass)).toBe(true);
  });

  test('removes entity icon', () => {
    const items = ['item-1', 'item-2'];
    const el = document.createElement('div');
    const world = new World(el);
    items.forEach((item) => {
      world.entities.items.set(item, entityWithIcon());
    });
    const entity1 = world.entities.items.get(items[0]);
    const removeSpy1 = jest.spyOn(entity1.outputs.icon, 'remove');
    const entity2 = world.entities.items.get(items[1]);
    const removeSpy2 = jest.spyOn(entity2.outputs.icon, 'remove');

    world.deleteEntity(items[0]);
    expect(removeSpy1).toHaveBeenCalledTimes(1);
    expect(removeSpy2).not.toHaveBeenCalled();
  });

  test('removes entity from icons by default', () => {
    const items = ['item-1', 'item-2'];
    const el = document.createElement('div');
    const world = new World(el);
    const entity1 = entityWithIcon();
    const entity2 = entityWithIcon();
    world.entities.items.set(items[0], entity1);
    world.entities.items.set(items[1], entity2);
    world.entities.creatures.set('creature-1', entityWithIcon());

    world.deleteEntity(items[0]);
    expect(world.entities.items.get(items[0])).toBeUndefined();
    expect(world.entities.items.get(items[1])).toBe(entity2);
    expect(world.entities.creatures.size).toBe(1);
  });

  test('removes entity from creatures when specified', () => {
    const creatures = ['creature-1', 'creature-2'];
    const el = document.createElement('div');
    const world = new World(el);
    const entity1 = entityWithIcon();
    const entity2 = entityWithIcon();
    world.entities.creatures.set(creatures[0], entity1);
    world.entities.creatures.set(creatures[1], entity2);
    world.entities.items.set('item-1', entityWithIcon());

    world.deleteEntity(creatures[0], 'creatures');
    expect(world.entities.creatures.get(creatures[0])).toBeUndefined();
    expect(world.entities.creatures.get(creatures[1])).toBe(entity2);
    expect(world.entities.items.size).toBe(1);
  });
});
