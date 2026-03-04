/**
 * @jest-environment jsdom
 */

import 'jest-canvas-mock';
import { World } from '../../../src/world/World';
import { motiveList, stateList, goalList } from '../../../src/defaults';

describe('MetabolismManager', () => {
  let el, world, creatures;
  beforeEach(() => {
    jest.clearAllMocks();
    el = document.createElement('div');
    world = new World(el);
    creatures = world.getCreatures();
    jest.spyOn(World.prototype, 'tick').mockImplementation(function () {});
  });
  afterEach(() => jest.restoreAllMocks());

  test('decays all motives if not supressed and rolls are below threshold', () => {
    creatures.forEach((creature) => {
      jest.spyOn(Math, 'random').mockReturnValue(0);
      for (let motive in creature.status.motives) {
        if (creature.status.motives[motive] === 0)
          creature.status.motives[motive]++;
      }
      const motivesPrev = JSON.parse(JSON.stringify(creature.getMotives()));
      creature.setState(stateList.wander);
      creature.metabolismManager.update(creature);
      const motivesAfter = creature.getMotives();

      for (let motive in motivesAfter) {
        expect(motivesAfter[motive]).toBe(motivesPrev[motive] - 1);
      }
    });
  });

  test('no motive decay if rolls above thresholds', () => {
    creatures.forEach((creature) => {
      jest.spyOn(Math, 'random').mockReturnValue(1);
      for (let motive in creature.status.motives) {
        if (creature.status.motives[motive] === 0)
          creature.status.motives[motive]++;
      }
      const motivesPrev = JSON.parse(JSON.stringify(creature.getMotives()));
      creature.setState(stateList.sleep);
      creature.metabolismManager.update(creature);
      const motivesAfter = creature.getMotives();

      for (let motive in motivesAfter) {
        expect(motivesAfter[motive]).toBe(motivesPrev[motive]);
      }
    });
  });

  test('no motive decay if state supresses it', () => {
    creatures.forEach((creature) => {
      jest.spyOn(Math, 'random').mockReturnValue(0);
      for (let motive in creature.status.motives) {
        if (creature.status.motives[motive] === 0) motive++;
      }
      const motivesPrev = JSON.parse(JSON.stringify(creature.getMotives()));
      creature.setState(stateList.sleep);
      creature.metabolismManager.update(creature);
      const motivesAfter = creature.getMotives();

      for (let motive in motivesAfter) {
        if (motive === motiveList.energy) {
          expect(motivesAfter[motive]).toBe(motivesPrev[motive]);
        } else {
          expect(motivesAfter[motive]).toBe(motivesPrev[motive] - 1);
        }
      }
    });
  });

  test('adds goal if required', () => {
    creatures.forEach((creature) => {
      jest.spyOn(Math, 'random').mockReturnValue(0);
      const maxMotive = creature.getMaxMotive();
      for (let motive in creature.status.motives) {
        if (motive === motiveList.fullness) {
          creature.status.motives[motive] = 0;
        } else {
          creature.status.motives[motive] = maxMotive;
        }
      }
      creature.setState(stateList.wander);
      expect(creature.getGoals()).not.toHaveProperty(goalList.eat);

      creature.metabolismManager.update(creature);
      expect(creature.getGoals()).toHaveProperty(goalList.eat);
    });
  });

  test('does not add goal if already present', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);
    creatures.forEach((creature) => {
      const maxMotive = creature.getMaxMotive();
      for (let motive in creature.status.motives) {
        if (motive === motiveList.fullness) {
          creature.status.motives[motive] = 0;
        } else {
          creature.status.motives[motive] = maxMotive;
        }
      }
      creature.setState(stateList.wander);
      creature.metabolismManager.update(creature);
      creature.metabolismManager.update(creature);
      expect(Object.keys(creature.getGoals())).toHaveLength(1);
    });
  });
});
