/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';
import { World } from '../../../src/world/World';

describe('toggleItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(World.prototype, 'init').mockImplementation(function () {});
  });
  afterEach(() => jest.restoreAllMocks());

  test('runs deleteEntity if item present', () => {
    const deleteEntity = jest
      .spyOn(World.prototype, 'deleteEntity')
      .mockImplementation(function () {});
    const findEmptyPosition = jest
      .spyOn(World.prototype, 'findEmptyPosition')
      .mockImplementation(function () {});
    const id = 'item-1';
    const className = 'item-class';
    const el = document.createElement('div');
    const world = new World(el);

    const btn = document.createElement('button');
    btn.dataset.entityId = id;

    world.toggleItem(btn, className, true);
    expect(deleteEntity).toHaveBeenCalledTimes(1);
    expect(deleteEntity).toHaveBeenCalledWith(id);
    expect(findEmptyPosition).not.toHaveBeenCalled();
  });

  test('passes deleteItem event to broadcast function', () => {
    jest
      .spyOn(World.prototype, 'deleteEntity')
      .mockImplementation(function () {});
    const broadcast = jest
      .spyOn(World.prototype, 'broadcast')
      .mockImplementation(function () {});
    const findEmptyPosition = jest
      .spyOn(World.prototype, 'findEmptyPosition')
      .mockImplementation(function () {});
    const id = 'item-1';
    const className = 'item-class';
    const deleteEvent = 'deleteItem';
    const el = document.createElement('div');
    const world = new World(el);

    const btn = document.createElement('button');
    btn.dataset.entityId = id;

    world.toggleItem(btn, className, true);
    expect(broadcast).toHaveBeenCalledTimes(1);
    expect(broadcast).toHaveBeenCalledWith(deleteEvent, { detail: id });
    expect(findEmptyPosition).not.toHaveBeenCalled();
  });

  test('runs findEmptyPosition if item not present', () => {
    const deleteEntity = jest
      .spyOn(World.prototype, 'deleteEntity')
      .mockImplementation(function () {});
    const findEmptyPosition = jest
      .spyOn(World.prototype, 'findEmptyPosition')
      .mockImplementation(function () {});
    const className = 'item-class';
    const el = document.createElement('div');
    const world = new World(el);

    const btn = document.createElement('button');
    world.toggleItem(btn, className, true);

    expect(deleteEntity).not.toHaveBeenCalled();
    expect(findEmptyPosition).toHaveBeenCalledTimes(1);
  });

  test('does not run addEntity if no position found', () => {
    const broadcast = jest
      .spyOn(World.prototype, 'broadcast')
      .mockImplementation(function () {});
    const addEntity = jest
      .spyOn(World.prototype, 'addEntity')
      .mockImplementation(function () {});
    jest.spyOn(World.prototype, 'findEmptyPosition').mockReturnValue(null);
    const className = 'item-class';
    const el = document.createElement('div');
    const world = new World(el);

    const btn = document.createElement('button');
    world.toggleItem(btn, className, true);

    expect(addEntity).not.toHaveBeenCalled();
    expect(btn.classList.contains('item-active')).toBe(false);
    expect(btn.dataset.entityId).toBeUndefined();
    expect(broadcast).not.toHaveBeenCalled();
  });

  test('runs addEntity with found position', () => {
    const pos = { xPos: 5, yPos: 6 };
    jest.spyOn(World.prototype, 'broadcast').mockImplementation(function () {});
    const addEntity = jest
      .spyOn(World.prototype, 'addEntity')
      .mockImplementation(function () {});
    jest.spyOn(World.prototype, 'findEmptyPosition').mockReturnValue(pos);
    const className = 'item-class';
    const el = document.createElement('div');
    const world = new World(el);

    const btn = document.createElement('button');
    world.toggleItem(btn, className, true);

    expect(addEntity).toHaveBeenCalledTimes(1);
    expect(addEntity).toHaveBeenCalledWith(className, pos);
  });

  test('adds new item id and active class to button', () => {
    const pos = { xPos: 5, yPos: 6 };
    const newItemId = 'new-item-id';
    jest.spyOn(World.prototype, 'broadcast').mockImplementation(function () {});
    jest.spyOn(World.prototype, 'addEntity').mockReturnValue(newItemId);
    jest.spyOn(World.prototype, 'findEmptyPosition').mockReturnValue(pos);
    const className = 'item-class';
    const el = document.createElement('div');
    const world = new World(el);

    const btn = document.createElement('button');
    world.toggleItem(btn, className, true);

    expect(btn.classList.contains('item-active')).toBe(true);
    expect(btn.dataset.entityId).toBe(newItemId);
  });

  test('passes addItem event to broadcast function if item added by user click', () => {
    const pos = { xPos: 5, yPos: 6 };
    const newItemId = 'new-item-id';
    const broadcast = jest
      .spyOn(World.prototype, 'broadcast')
      .mockImplementation(function () {});
    const addEntity = jest
      .spyOn(World.prototype, 'addEntity')
      .mockReturnValue(newItemId);
    jest.spyOn(World.prototype, 'findEmptyPosition').mockReturnValue(pos);
    const addEvent = 'addItem';
    const className = 'item-class';
    const el = document.createElement('div');
    const world = new World(el);

    const btn = document.createElement('button');
    world.toggleItem(btn, className, true);

    expect(addEntity).toHaveBeenCalledTimes(1);
    expect(broadcast).toHaveBeenCalledTimes(1);
    expect(broadcast).toHaveBeenCalledWith(addEvent, { detail: newItemId });
  });

  test('does not run broadcast function if item not added by user click', () => {
    const pos = { xPos: 5, yPos: 6 };
    const broadcast = jest
      .spyOn(World.prototype, 'broadcast')
      .mockImplementation(function () {});
    const addEntity = jest
      .spyOn(World.prototype, 'addEntity')
      .mockImplementation(function () {});
    jest.spyOn(World.prototype, 'findEmptyPosition').mockReturnValue(pos);

    const className = 'item-class';
    const el = document.createElement('div');
    const world = new World(el);

    const btn = document.createElement('button');
    world.toggleItem(btn, className, false);

    expect(addEntity).toHaveBeenCalledTimes(1);
    expect(broadcast).not.toHaveBeenCalled();
  });
});
