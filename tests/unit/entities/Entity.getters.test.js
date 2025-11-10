/**
 * @jest-environment jsdom
 */
const maxMotive = 100;
const worldX = 5;
const worldY = 6;
jest.mock('../../../src/world/World', () => {
  const MockWorld = class World {
    constructor() {
      this.params = { maxMotive, lineWidth: 1, cellSize: 10 };
    }
    getParam(param) {
      return this.params[param];
    }
    displayEntity() {
      return jest.fn();
    }
    getBounds() {
      return { x: worldX, y: worldY };
    }
  };
  return { __esModule: true, World: MockWorld };
});

import { World as MockWorld } from '../../../src/world/World';
import Entity from '../../../src/entities/Entity';
import worldManager from '../../../src/managers/WorldManager';
import { utilities } from '../../../src/utils/Utilities';
import {
  adjectiveList,
  flavorList,
  colorList,
  motiveList,
} from '../../../src/defaults';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getters', () => {
  describe('getWorld', () => {
    test('returns world ID', () => {
      jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
      const world = 'w-1';
      const entity = new Entity(world);

      expect(entity.getWorld()).toBe(world);
    });
  });

  describe('getGUID', () => {
    test('returns entity GUID', () => {
      jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
      const id = 'entity-1';
      jest.spyOn(utilities, 'generateGUID').mockReturnValue(id);
      const entity = new Entity('w-1');

      expect(entity.getGUID()).toBe(id);
    });
  });

  describe('getAdjectives', () => {
    test('returns array of given adjectives', () => {
      jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
      const entity = new Entity('w-1');
      const adjectives = [adjectiveList.chew, adjectiveList.bounce];

      entity.properties.adjectives.push(...adjectives);
      expect(entity.getAdjectives()).toEqual(adjectives);
    });
  });

  describe('getFlavors', () => {
    test('returns array of given flavors', () => {
      jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
      const entity = new Entity('w-1');
      const flavors = [flavorList.chicken];

      entity.properties.flavors.push(...flavors);
      expect(entity.getFlavors()).toEqual(flavors);
    });
  });

  describe('getColors', () => {
    test('returns array of given colors', () => {
      jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
      const entity = new Entity('w-1');
      const colors = [colorList.white, colorList.brown];

      entity.properties.colors.push(...colors);
      expect(entity.getColors()).toEqual(colors);
    });
  });

  describe('getPosition', () => {
    test('returns entity position', () => {
      jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
      const x = 2;
      const y = 3;
      const entity = new Entity('w-1', { xPos: x, yPos: y });

      expect(entity.getPosition()).toEqual({ x, y });
    });

    test('returns same object as status', () => {
      jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
      const x = 2;
      const y = 3;
      const entity = new Entity('w-1', { xPos: x, yPos: y });

      expect(entity.getPosition()).toBe(entity.getStatus().position);
    });
  });

  describe('getBounds', () => {
    test('returns bounds from world', () => {
      jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
      const entity = new Entity('w-1');

      expect(entity.getBounds()).toEqual({ x: worldX, y: worldY });
    });
  });

  describe('getStatus', () => {
    test('returns status object', () => {
      jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
      const x = 2;
      const y = 3;
      const entity = new Entity('w-1', { xPos: x, yPos: y });

      const status = {
        position: { x, y },
        motives: {},
      };

      expect(entity.getStatus()).toEqual(status);
    });
  });

  describe('getOutputs', () => {
    test('returns outputs object', () => {
      jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
      const entity = new Entity('w-1');

      expect(entity.getOutputs()).toHaveProperty('icon');
    });
  });

  describe('getMaxMotive', () => {
    test('returns max motive from world', () => {
      jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
      const entity = new Entity('w-1');

      expect(entity.getMaxMotive()).toBe(maxMotive);
    });
  });

  describe('getMotives', () => {
    test('returns motive object with relevant properties', () => {
      jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
      const entity = new Entity('w-1');
      const motives = [
        motiveList.fullness,
        motiveList.hydration,
        motiveList.energy,
      ];

      motives.forEach((motive, i) => {
        entity.status.motives[motive] = (i + 1) * 10;
      });

      const result = entity.getMotives();
      motives.forEach((motive, i) => {
        expect(result).toHaveProperty(motive);
        expect(result[motive]).toEqual((i + 1) * 10);
      });
      expect(result).not.toHaveProperty(motiveList.amount);
    });

    test('returns same object as getStatus', () => {
      jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
      const entity = new Entity('w-1');
      const motives = [
        motiveList.fullness,
        motiveList.hydration,
        motiveList.energy,
      ];

      motives.forEach((motive, i) => {
        entity.status.motives[motive] = (i + 1) * 10;
      });

      expect(entity.getMotives()).toBe(entity.getStatus().motives);
    });
  });

  describe('getMotive', () => {
    test('displays error if passed motive does not exist', () => {
      const err = jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
      const entity = new Entity('w-1');
      const motives = [
        motiveList.fullness,
        motiveList.hydration,
        motiveList.energy,
      ];

      motives.forEach((motive, i) => {
        entity.status.motives[motive] = 10;
      });

      const result = entity.getMotive(motiveList.amount);
      expect(err).toHaveBeenCalledTimes(1);
      expect(err).toHaveBeenCalledWith(
        `Error: no ${motiveList.amount} motive found`
      );
      expect(result).toBeUndefined();
    });

    test('returns given motive if present', () => {
      jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
      const entity = new Entity('w-1');
      const motives = [
        motiveList.fullness,
        motiveList.hydration,
        motiveList.energy,
      ];

      motives.forEach((motive, i) => {
        entity.status.motives[motive] = (i + 1) * 10;
      });

      motives.forEach((motive, i) => {
        expect(entity.getMotive(motive)).toEqual((i + 1) * 10);
      });
    });
  });

  describe('getIcon', () => {
    test('displays error if no icon present', () => {
      const err = jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(Entity.prototype, 'init').mockImplementation(() => {});
      jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
      const entity = new Entity('w-1');

      const result = entity.getIcon();
      expect(err).toHaveBeenCalledTimes(1);
      expect(err).toHaveBeenCalledWith(
        `Error: no icon found for entity ${entity.getGUID()}`
      );
      expect(result).toBeUndefined();
    });

    test('returns entity icon', () => {
      const icon = document.createElement('div');
      jest.spyOn(Entity.prototype, 'init').mockImplementation(function () {
        this.outputs.icon = icon;
      });
      jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
      const entity = new Entity('w-1');

      const result = entity.getIcon();
      expect(result).toBe(icon);
    });
  });
});
