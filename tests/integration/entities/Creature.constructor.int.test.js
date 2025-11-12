/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';

import { World } from '../../../src/world/World';
import Creature from '../../../src/entities/Creature';
import { GoalManager } from '../../../src/managers/GoalManager';
import { MetabolismManager } from '../../../src/managers/MetabolismManager';
import { EmotionManager } from '../../../src/managers/EmotionManager';
import states from '../../../src/state_machine/states';
import plans from '../../../src/state_machine/plans';
import goals from '../../../src/state_machine/goals';
import { queries } from '../../../src/utils/Queries';

describe('constructor', () => {
  test('outputs.bubble is div element', () => {
    const el = document.createElement('div');
    const world = new World(el);

    const creature = new Creature(world.getGUID());
    expect(creature.getOutputs().bubble).toBeInstanceOf(HTMLDivElement);
  });

  test('creates managers of correct type', () => {
    const el = document.createElement('div');
    const world = new World(el);

    const creature = new Creature(world.getGUID());
    expect(creature.goalManager).toBeInstanceOf(GoalManager);
    expect(creature.metabolismManager).toBeInstanceOf(MetabolismManager);
    expect(creature.emotionManager).toBeInstanceOf(EmotionManager);
  });

  test('imports states', () => {
    const el = document.createElement('div');
    const world = new World(el);

    const creature = new Creature(world.getGUID());
    expect(creature.states).toBe(states);
  });

  test('imports plans', () => {
    const el = document.createElement('div');
    const world = new World(el);

    const creature = new Creature(world.getGUID());
    expect(creature.plans).toBe(plans);
  });

  test('imports goals', () => {
    const el = document.createElement('div');
    const world = new World(el);

    const creature = new Creature(world.getGUID());
    expect(creature.goals).toBe(goals);
  });

  test('imports queries', () => {
    const el = document.createElement('div');
    const world = new World(el);

    const creature = new Creature(world.getGUID());
    expect(creature.queries).toBe(queries);
  });
});
