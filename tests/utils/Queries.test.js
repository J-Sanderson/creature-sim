import {
  motiveList,
  personalityValueList,
  flavorList,
} from '../../src/defaults';
import { creatureBuilder } from '../helpers/creatureBuilder';
import { worldBuilder } from '../helpers/worldBuilder';
import { itemBuilder } from '../helpers/itemBuilder';
import { directions } from '../helpers/directions';
import { queries } from '../../src/utils/Queries';
import worldManager from '../../src/managers/WorldManager';

jest.mock('../../src/managers/WorldManager.js', () => ({
  __esModule: true,
  default: { getWorld: jest.fn() },
}));
beforeEach(() => jest.clearAllMocks());

describe('amIThirsty', () => {
  test('returns false if threshold is falsy', () => {
    const self = creatureBuilder({});
    expect(queries.amIThirsty(self)).toBe(false);
  });

  test('returns true if hydration is below threshold', () => {
    const self = creatureBuilder({
      thresholdByMotive: { [motiveList.hydration]: 50 },
      motiveByMotive: { [motiveList.hydration]: 49 },
    });
    expect(queries.amIThirsty(self)).toBe(true);
  });

  test('returns false if hydration is equal to threshold', () => {
    const self = creatureBuilder({
      thresholdByMotive: { [motiveList.hydration]: 50 },
      motiveByMotive: { [motiveList.hydration]: 50 },
    });
    expect(queries.amIThirsty(self)).toBe(false);
  });

  test('returns false if hydration is greater than threshold', () => {
    const self = creatureBuilder({
      thresholdByMotive: { [motiveList.hydration]: 50 },
      motiveByMotive: { [motiveList.hydration]: 51 },
    });
    expect(queries.amIThirsty(self)).toBe(false);
  });
});

describe('amITired', () => {
  test('returns false if threshold is falsy', () => {
    const self = creatureBuilder({
      thresholdByMotive: {},
      motiveByMotive: {},
    });
    expect(queries.amITired(self)).toBe(false);
  });

  test('returns true if energy is below threshold', () => {
    const self = creatureBuilder({
      thresholdByMotive: { [motiveList.energy]: 50 },
      motiveByMotive: { [motiveList.energy]: 49 },
    });
    expect(queries.amITired(self)).toBe(true);
  });

  test('returns false if energy is equal to threshold', () => {
    const self = creatureBuilder({
      thresholdByMotive: { [motiveList.energy]: 50 },
      motiveByMotive: { [motiveList.energy]: 50 },
    });
    expect(queries.amITired(self)).toBe(false);
  });

  test('returns false if energy is greater than threshold', () => {
    const self = creatureBuilder({
      thresholdByMotive: { [motiveList.energy]: 50 },
      motiveByMotive: { [motiveList.energy]: 51 },
    });
    expect(queries.amITired(self)).toBe(false);
  });
});

describe('amIFinicky', () => {
  test('returns false if finickiness is falsy', () => {
    const self = creatureBuilder({});
    expect(queries.amIFinicky(self)).toBe(false);
  });

  test('returns false if maxMotive is falsy', () => {
    const self = creatureBuilder({
      personalityByValue: { [personalityValueList.finickiness]: 25 },
      maxMotive: 0,
    });
    expect(queries.amIFinicky(self)).toBe(false);
  });

  test('returns false if random roll is greater than ratio', () => {
    const self = creatureBuilder({
      personalityByValue: { [personalityValueList.finickiness]: 25 },
      maxMotive: 100,
    });

    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.3);
    expect(queries.amIFinicky(self)).toBe(false);
    spy.mockRestore();
  });

  test('returns true if random roll is equal to ratio', () => {
    const self = creatureBuilder({
      personalityByValue: { [personalityValueList.finickiness]: 25 },
      maxMotive: 100,
    });

    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.25);
    expect(queries.amIFinicky(self)).toBe(true);
    spy.mockRestore();
  });

  test('returns true if random roll is less than ratio', () => {
    const self = creatureBuilder({
      personalityByValue: { [personalityValueList.finickiness]: 25 },
      maxMotive: 100,
    });

    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.2);
    expect(queries.amIFinicky(self)).toBe(true);
    spy.mockRestore();
  });
});

describe('getItemsByFlavor', () => {
  test('returns an empty array if no valid world passed', () => {
    worldManager.getWorld.mockReturnValue(undefined);
    const id = 'w-missing';
    const self = creatureBuilder({ world: id });

    const items = queries.getItemsByFlavor(self, flavorList.chicken);
    expect(worldManager.getWorld).toHaveBeenCalledWith(id);
    expect(items).toEqual([]);
  });

  test('returns array of valid items if flavor present', () => {
    const id = 'w-1';
    const chicken = itemBuilder({
      properties: { flavors: [flavorList.chicken] },
    });
    const beef = itemBuilder({ properties: { flavors: [flavorList.beef] } });
    worldManager.getWorld.mockReturnValue(
      worldBuilder({
        entities: { items: [chicken, beef] },
      })
    );
    const self = creatureBuilder({ world: id });

    const items = queries.getItemsByFlavor(self, flavorList.chicken);
    expect(worldManager.getWorld).toHaveBeenCalledWith(id);
    expect(items).toHaveLength(1);
    expect(items[0].getFlavors()).toContain(flavorList.chicken);
  });

  test('returns empty array if flavour not present', () => {
    const id = 'w-1';
    const beef = itemBuilder({ properties: { flavors: [flavorList.beef] } });
    const fish = itemBuilder({ properties: { flavors: [flavorList.fish] } });
    worldManager.getWorld.mockReturnValue(
      worldBuilder({
        entities: { items: [beef, fish] },
      })
    );
    const self = creatureBuilder({ world: id });

    const items = queries.getItemsByFlavor(self, flavorList.chicken);
    expect(worldManager.getWorld).toHaveBeenCalledWith(id);
    expect(items).toEqual([]);
  });
});

describe('getValidDirections', () => {
  test('returns all eight directions if not on an edge square', () => {
    const self = creatureBuilder({
      position: { x: 5, y: 5 },
    });

    const dirs = queries.getValidDirections(self);
    expect(dirs).toHaveLength(8);
    for (direction in directions) {
      expect(dirs).toContainEqual(directions[direction]);
    }
  });

  test('returns E, SE, S from top left', () => {
    const self = creatureBuilder({});

    const dirs = queries.getValidDirections(self);
    expect(dirs).toHaveLength(3);
    expect(dirs).toEqual(
      expect.arrayContaining([directions.E, directions.SE, directions.S])
    );
    expect(dirs).not.toEqual(
      expect.arrayContaining([
        directions.NW,
        directions.N,
        directions.NE,
        directions.SW,
        directions.W,
      ])
    );
  });

  test('returns W, SW, S from top right', () => {
    const self = creatureBuilder({
      position: { x: 14, y: 0 },
    });

    const dirs = queries.getValidDirections(self);
    expect(dirs).toHaveLength(3);
    expect(dirs).toEqual(
      expect.arrayContaining([directions.W, directions.SW, directions.S])
    );
    expect(dirs).not.toEqual(
      expect.arrayContaining([
        directions.NW,
        directions.N,
        directions.NE,
        directions.E,
        directions.SE,
      ])
    );
  });

  test('returns N, NW, W from bottom right', () => {
    const self = creatureBuilder({
      position: { x: 14, y: 14 },
    });

    const dirs = queries.getValidDirections(self);
    expect(dirs).toHaveLength(3);
    expect(dirs).toEqual(
      expect.arrayContaining([directions.N, directions.NW, directions.W])
    );
    expect(dirs).not.toEqual(
      expect.arrayContaining([
        directions.NE,
        directions.E,
        directions.SE,
        directions.S,
        directions.SW,
      ])
    );
  });

  test('returns N, NE, E from bottom left', () => {
    const self = creatureBuilder({
      position: { x: 0, y: 14 },
    });

    const dirs = queries.getValidDirections(self);
    expect(dirs).toHaveLength(3);
    expect(dirs).toEqual(
      expect.arrayContaining([directions.N, directions.NE, directions.E])
    );
    expect(dirs).not.toEqual(
      expect.arrayContaining([
        directions.NW,
        directions.SE,
        directions.S,
        directions.SW,
        directions.W,
      ])
    );
  });

  test('returns W, SW, S, SE, E from top edge', () => {
    const self = creatureBuilder({
      position: { x: 5, y: 0 },
    });

    const dirs = queries.getValidDirections(self);
    expect(dirs).toHaveLength(5);
    expect(dirs).toEqual(
      expect.arrayContaining([
        directions.W,
        directions.SW,
        directions.S,
        directions.SE,
        directions.E,
      ])
    );
    expect(dirs).not.toEqual(
      expect.arrayContaining([directions.NW, directions.N, directions.NE])
    );
  });

  test('returns N, NW, W, SW, S from right edge', () => {
    const self = creatureBuilder({
      position: { x: 14, y: 5 },
    });

    const dirs = queries.getValidDirections(self);
    expect(dirs).toHaveLength(5);
    expect(dirs).toEqual(
      expect.arrayContaining([
        directions.N,
        directions.NW,
        directions.W,
        directions.SW,
        directions.S,
      ])
    );
    expect(dirs).not.toEqual(
      expect.arrayContaining([directions.NE, directions.E, directions.SE])
    );
  });

  test('returns W, NW, N, NE, E from bottom edge', () => {
    const self = creatureBuilder({
      position: { x: 5, y: 14 },
    });

    const dirs = queries.getValidDirections(self);
    expect(dirs).toHaveLength(5);
    expect(dirs).toEqual(
      expect.arrayContaining([
        directions.W,
        directions.NW,
        directions.N,
        directions.NE,
        directions.E,
      ])
    );
    expect(dirs).not.toEqual(
      expect.arrayContaining([directions.SW, directions.S, directions.SE])
    );
  });

  test('returns N, NE, E, SE, S from left edge', () => {
    const self = creatureBuilder({
      position: { x: 0, y: 5 },
    });

    const dirs = queries.getValidDirections(self);
    expect(dirs).toHaveLength(5);
    expect(dirs).toEqual(
      expect.arrayContaining([
        directions.N,
        directions.NE,
        directions.E,
        directions.SE,
        directions.S,
      ])
    );
    expect(dirs).not.toEqual(
      expect.arrayContaining([directions.NW, directions.W, directions.SW])
    );
  });

  test('returns no valid directions if creature fully out of bounds', () => {
    const self = creatureBuilder({
      position: { x: 16, y: 16 },
    });

    const dirs = queries.getValidDirections(self);
    expect(dirs).toEqual([]);
  });

  test('returns no valid directions on a 1x1 grid', () => {
    const self = creatureBuilder({
      bounds: { x: 1, y: 1 },
    });

    const dirs = queries.getValidDirections(self);
    expect(dirs).toEqual([]);
  });

  test('every returned direction leads to an in-bounds tile', () => {
    const self = creatureBuilder({
      position: { x: 1, y: 1 },
      bounds: { x: 3, y: 2 },
    });
    const { x, y } = self.getPosition();
    const { x: maxX, y: maxY } = self.getBounds();

    for (const dir of queries.getValidDirections(self)) {
      const newX = x + dir.dx;
      const newY = y + dir.dy;

      expect(newX).toBeGreaterThanOrEqual(0);
      expect(newY).toBeLessThan(maxX);
      expect(newY).toBeGreaterThanOrEqual(0);
      expect(newY).toBeLessThan(maxY);
    }
  });
});
