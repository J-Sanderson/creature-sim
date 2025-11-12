/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';

import { World } from '../../../src/world/World';
import Creature from '../../../src/entities/Creature';
import Water from '../../../src/entities/items/Water';
import { goalList } from '../../../src/defaults';
import GoalBePetted from '../../../src/state_machine/goals/GoalBePetted';
import GoalAddedItem from '../../../src/state_machine/goals/GoalAddedItem';
import GoalMissingItem from '../../../src/state_machine/goals/GoalMissingItem';

describe('setEventHandlers', () => {
  test('mousedown on icon adds GoalBePetted to creature goals', () => {
    const el = document.createElement('div');
    const world = new World(el);

    const creature = new Creature(world.getGUID());
    const icon = creature.getIcon();
    icon.dispatchEvent(new MouseEvent('mousedown'));

    const goals = creature.getGoals();
    expect(goals).toHaveProperty(goalList.pet);
    expect(goals[goalList.pet]).toBeInstanceOf(GoalBePetted);
    expect(creature.getCurrentGoalName()).toBe(goalList.pet);
  });

  test('mousedown on icon passes correct static parameters to GoalBePetted', () => {
    const el = document.createElement('div');
    const world = new World(el);

    const creature = new Creature(world.getGUID());
    const icon = creature.getIcon();
    icon.dispatchEvent(new MouseEvent('mousedown'));

    const goals = creature.getGoals();
    const goal = goals[goalList.pet];

    expect(goal.goalToken.priority).toBe(1);
    expect(goal.goalToken.suspended).toBe(false);
  });

  test('mouseup on icon removes GoalBePetted', () => {
    const el = document.createElement('div');
    const world = new World(el);

    const creature = new Creature(world.getGUID());
    const icon = creature.getIcon();
    icon.dispatchEvent(new MouseEvent('mousedown'));
    expect(creature.getGoals()).toHaveProperty(goalList.pet);

    icon.dispatchEvent(new MouseEvent('mouseup'));

    expect(creature.getGoals()).not.toHaveProperty(goalList.pet);
    expect(creature.getCurrentGoalName()).not.toBe(goalList.pet);
  });

  test('addItem on icon adds GoalAddedItem to creature goals', () => {
    const el = document.createElement('div');
    const world = new World(el);

    const creature = new Creature(world.getGUID());
    const icon = creature.getIcon();

    const item = new Water(world.getGUID());
    const itemID = item.getGUID();

    const event = new CustomEvent('addItem', { detail: itemID });
    icon.dispatchEvent(event);

    const goals = creature.getGoals();
    expect(goals).toHaveProperty(goalList.addedItem);
    expect(goals[goalList.addedItem]).toBeInstanceOf(GoalAddedItem);
    expect(creature.getCurrentGoalName()).toBe(goalList.addedItem);
  });

  test('addItem on icon passes correct static parameters to GoalAddedItem', () => {
    const el = document.createElement('div');
    const world = new World(el);

    const creature = new Creature(world.getGUID());
    const icon = creature.getIcon();

    const item = new Water(world.getGUID());
    const itemID = item.getGUID();

    const event = new CustomEvent('addItem', { detail: itemID });
    icon.dispatchEvent(event);

    const goals = creature.getGoals();
    const goal = goals[goalList.addedItem];

    expect(goal.goalToken.priority).toBe(5);
    expect(goal.goalToken.suspended).toBe(false);
    expect(goal.goalToken.ticks).toBe(1);
    expect(goal.worldToken.target).toBe(itemID);
  });

  test('deleteItem on icon adds GoalMissingItem to creature goals', () => {
    const el = document.createElement('div');
    const world = new World(el);

    const creature = new Creature(world.getGUID());
    const icon = creature.getIcon();

    const item = new Water(world.getGUID());
    const itemID = item.getGUID();

    const addEvent = new CustomEvent('addItem', { detail: itemID });
    icon.dispatchEvent(addEvent);

    const deleteEvent = new CustomEvent('deleteItem', { detail: itemID });
    icon.dispatchEvent(deleteEvent);

    const goals = creature.getGoals();
    expect(goals).toHaveProperty(goalList.missingItem);
    expect(goals[goalList.missingItem]).toBeInstanceOf(GoalMissingItem);
  });

  test('deleteItem on icon passes correct static parameters to GoalMissingItem', () => {
    const el = document.createElement('div');
    const world = new World(el);

    const creature = new Creature(world.getGUID());
    const icon = creature.getIcon();

    const item = new Water(world.getGUID());
    const itemID = item.getGUID();

    const addEvent = new CustomEvent('addItem', { detail: itemID });
    icon.dispatchEvent(addEvent);

    const deleteEvent = new CustomEvent('deleteItem', { detail: itemID });
    icon.dispatchEvent(deleteEvent);

    const goals = creature.getGoals();
    const goal = goals[goalList.missingItem];

    expect(goal.goalToken.priority).toBe(5);
    expect(goal.goalToken.suspended).toBe(false);
    expect(goal.goalToken.ticks).toBe(1);
    expect(goal.worldToken.target).toBe(itemID);
  });
});
