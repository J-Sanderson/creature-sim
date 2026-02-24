/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';
import { World } from '../../../src/world/World';
import Water from '../../../src/entities/items/Water';
import Creature from '../../../src/entities/Creature';
import { goalList } from '../../../src/defaults';
import GoalAddedItem from '../../../src/state_machine/goals/GoalAddedItem';
import GoalMissingItem from '../../../src/state_machine/goals/GoalMissingItem';

beforeEach(() => {
  jest.spyOn(World.prototype, 'tick').mockImplementation(() => {});
  jest.clearAllMocks();
});
afterEach(() => jest.restoreAllMocks());

describe('init', () => {
  describe('toybox functionality', () => {
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

    test('user click on toybox button registers GoalAddedItem on creatures', () => {
      const el = document.createElement('div');
      const world = new World(el);

      world.entities.items.clear();
      const toybox = world.getElement('toybox');
      const btn = toybox.querySelector('#btn-Water');

      // Simulate user click (bypass e.isTrusted)
      const originalToggleItem = World.prototype.toggleItem;
      jest
        .spyOn(World.prototype, 'toggleItem')
        .mockImplementation(function (button, item) {
          return originalToggleItem.call(this, button, item, true);
        });
      btn.click();

      const items = world.getItems();
      const item = items.values().next().value;
      const itemID = item.getGUID();

      const creatures = world.getCreatures();
      creatures.forEach((creature) => {
        const goals = creature.getGoals();
        expect(goals).toHaveProperty(goalList.addedItem);
        expect(goals[goalList.addedItem]).toBeInstanceOf(GoalAddedItem);
        expect(goals[goalList.addedItem].worldToken.target).toBe(itemID);
      });
    });

    test('simulated click on toybox button does not register GoalAddedItem on creatures', () => {
      const el = document.createElement('div');
      const world = new World(el);

      world.entities.items.clear();
      const toybox = world.getElement('toybox');
      const btn = toybox.querySelector('#btn-Water');
      btn.click();

      const creatures = world.getCreatures();
      creatures.forEach((creature) => {
        const goals = creature.getGoals();
        expect(goals).not.toHaveProperty(goalList.addedItem);
      });
    });

    test('clicking active toybox button removes item from entities', () => {
      const el = document.createElement('div');
      const world = new World(el);

      world.entities.items.clear();
      const toybox = world.getElement('toybox');
      const btn = toybox.querySelector('#btn-Water');
      btn.click();
      btn.click();

      const items = world.getItems();
      expect(items.size).toBe(0);
    });

    test('clicking active toybox button removes button class and dataset', () => {
      const el = document.createElement('div');
      const world = new World(el);

      world.entities.items.clear();
      const toybox = world.getElement('toybox');
      const btn = toybox.querySelector('#btn-Water');
      btn.click();
      btn.click();

      expect(Array.from(btn.classList)).not.toContain('item-active');
      expect(btn.dataset.entityId).toBeUndefined();
    });

    test('user click on active toybox button registers GoalMissingItem on creatures', () => {
      const el = document.createElement('div');
      const world = new World(el);

      world.entities.items.clear();
      const toybox = world.getElement('toybox');
      const btn = toybox.querySelector('#btn-Water');
      btn.click();

      const items = world.getItems();
      const item = items.values().next().value;
      const itemID = item.getGUID();

      // Simulate user click (bypass e.isTrusted)
      const originalToggleItem = World.prototype.toggleItem;
      jest
        .spyOn(World.prototype, 'toggleItem')
        .mockImplementation(function (button, item) {
          return originalToggleItem.call(this, button, item, true);
        });
      btn.click();

      const creatures = world.getCreatures();
      creatures.forEach((creature) => {
        const goals = creature.getGoals();
        expect(goals).toHaveProperty(goalList.missingItem);
        expect(goals[goalList.missingItem]).toBeInstanceOf(GoalMissingItem);
        expect(goals[goalList.missingItem].worldToken.target).toBe(itemID);
      });
    });
  });

  describe('creature setup', () => {
    test('adds a single creature', () => {
      const el = document.createElement('div');
      const world = new World(el);

      const creatures = world.getCreatures();
      expect(creatures.values().next().value).toBeInstanceOf(Creature);
    });
  });
});
