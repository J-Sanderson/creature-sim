import { creatureBuilder } from '../../helpers/creatureBuilder';
import { queries } from '../../../src/utils/Queries';
import { directions } from '../../helpers/directions';

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