/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';

const maxMotive = 100;
jest.mock('../../../src/world/World', () => {
  const MockWorld = class World {
    constructor() {
      this.params = { maxMotive };
    }
    getParam(param) {
      return this.params[param];
    }
    displayEntity() {
      return jest.fn();
    }
    getBounds() {
      return { x: 5, y: 6 };
    }
  };
  return { __esModule: true, World: MockWorld };
});

import { World as MockWorld } from '../../../src/world/World';
import Creature from '../../../src/entities/Creature';
import worldManager from '../../../src/managers/WorldManager';
import { GoalManager } from '../../../src/managers/GoalManager';
import { MetabolismManager } from '../../../src/managers/MetabolismManager';
import { EmotionManager } from '../../../src/managers/EmotionManager';
import { adjectiveList, motiveList } from '../../../src/defaults';

jest.mock('../../../src/managers/GoalManager', () => {
  const GoalManager = jest.fn();
  return { __esModule: true, GoalManager };
});
jest.mock('../../../src/managers/MetabolismManager', () => {
  const MetabolismManager = jest.fn();
  return { __esModule: true, MetabolismManager };
});
jest.mock('../../../src/managers/EmotionManager', () => {
  const EmotionManager = jest.fn();
  return { __esModule: true, EmotionManager };
});

describe('constructor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
  });

  describe('outputs setup', () => {
    test('adds creature class to icon', () => {
      const creature = new Creature('w-1');

      expect(creature.outputs.icon.classList.contains('creature')).toBe(true);
    });

    test('adds bubble element to outputs', () => {
      const creature = new Creature('w-1');

      expect(creature.outputs).toHaveProperty('bubble');
    });

    test('adds bubble class to bubble element', () => {
      const creature = new Creature('w-1');

      expect(creature.outputs.bubble.classList.contains('bubble')).toBe(true);
    });

    test('bubble element is child of icon', () => {
      const creature = new Creature('w-1');

      expect(creature.outputs.bubble.parentElement).toBe(creature.outputs.icon);
    });

    test('sets order', () => {
      const creature = new Creature('w-1');

      expect(creature.order).toBe(2);
    });

    test('assigns default creature icon', () => {
      const creature = new Creature('w-1');

      expect(creature.icon).toBe('&#x1F415;');
    });

    test('runs setIcon', () => {
      const setIcon = jest
        .spyOn(Creature.prototype, 'setIcon')
        .mockImplementation(() => {});
      new Creature('w-1');

      expect(setIcon).toHaveBeenCalledTimes(1);
    });

    test('adds motives object to outputs', () => {
      const creature = new Creature('w-1');

      expect(creature.outputs).toHaveProperty('motives');
    });
  });

  describe('adjective setup', () => {
    test('contains animate adjective', () => {
      const creature = new Creature('w-1');

      expect(creature.properties.adjectives).toContain(adjectiveList.animate);
    });

    test('does not contain inanimate adjective', () => {
      const creature = new Creature('w-1');

      expect(creature.properties.adjectives).not.toContain(
        adjectiveList.inanimate
      );
    });
  });

  describe('motive setup', () => {
    test('adds applicable motives to status', () => {
      const creature = new Creature('w-1');

      Creature.validMotives.forEach((motive) => {
        expect(creature.status.motives).toHaveProperty(motive);
      });
    });

    test('does not apply non-applicable motives', () => {
      const creature = new Creature('w-1');

      expect(creature.status.motives).not.toHaveProperty(motiveList.amount);
    });

    test('all motives are >= 0', () => {
      const creature = new Creature('w-1');

      Creature.validMotives.forEach((motive) => {
        expect(creature.status.motives[motive]).toBeGreaterThanOrEqual(0);
      });
    });

    test('all motives are <= maxMotive', () => {
      const creature = new Creature('w-1');

      Creature.validMotives.forEach((motive) => {
        expect(creature.status.motives[motive]).toBeLessThanOrEqual(maxMotive);
      });
    });
  });

  describe('emotion setup', () => {
    test('creates emotion object', () => {
      const creature = new Creature('w-1');

      expect(creature.status).toHaveProperty('emotions');
    });

    test('adds applicable emotions to status.emotions', () => {
      const creature = new Creature('w-1');

      Creature.validEmotions.forEach((emotion) => {
        expect(creature.status.emotions).toHaveProperty(emotion);
      });
    });

    test('sets all emotions to 0', () => {
      const creature = new Creature('w-1');

      Creature.validEmotions.forEach((emotion) => {
        expect(creature.status.emotions[emotion]).toEqual(0);
      });
    });
  });

  describe('personality setup', () => {
    test('adds personality object', () => {
      const creature = new Creature('w-1');

      expect(creature.personality).toBeDefined();
      expect(creature.personality).toHaveProperty('values');
      expect(creature.personality).toHaveProperty('favorites');
      expect(creature.personality.favorites).toHaveProperty('flavor');
      expect(creature.personality.favorites).toHaveProperty('color');
    });

    test('adds applicable personality values to personality.values', () => {
      const creature = new Creature('w-1');

      Creature.validPersonalityValues.forEach((value) => {
        expect(creature.personality.values).toHaveProperty(value);
      });
    });

    test('all personality values are >= 0', () => {
      const creature = new Creature('w-1');

      Creature.validPersonalityValues.forEach((value) => {
        expect(creature.personality.values[value]).toBeGreaterThanOrEqual(0);
      });
    });

    test('all personality values are <= maxMotive', () => {
      const creature = new Creature('w-1');

      Creature.validPersonalityValues.forEach((value) => {
        expect(creature.personality.values[value]).toBeLessThanOrEqual(
          maxMotive
        );
      });
    });

    test('selects a random valid favourite flavor', () => {
      const creature = new Creature('w-1');

      expect(Creature.validFaves.flavors).toContain(
        creature.personality.favorites.flavor
      );
    });

    test('selects a random valid favourite color', () => {
      const creature = new Creature('w-1');

      expect(Creature.validFaves.colors).toContain(
        creature.personality.favorites.color
      );
    });
  });

  describe('state machine setup', () => {
    test('creates states object', () => {
      const creature = new Creature('w-1');

      expect(creature.states).toBeDefined();
      expect(typeof creature.states).toBe('object');
    });

    test('creates plans object', () => {
      const creature = new Creature('w-1');

      expect(creature.plans).toBeDefined();
      expect(typeof creature.plans).toBe('object');
    });

    test('creates goals object', () => {
      const creature = new Creature('w-1');

      expect(creature.goals).toBeDefined();
      expect(typeof creature.goals).toBe('object');
    });

    test('creates queries object', () => {
      const creature = new Creature('w-1');

      expect(creature.queries).toBeDefined();
      expect(typeof creature.queries).toBe('object');
    });

    test('runs setEventHandlers', () => {
      const setEventHandlers = jest
        .spyOn(Creature.prototype, 'setEventHandlers')
        .mockImplementation(() => {});
      new Creature('w-1');

      expect(setEventHandlers).toHaveBeenCalledTimes(1);
    });
  });

  describe('manager setup', () => {
    test('sets up goal manager', () => {
      new Creature('w-1');

      expect(GoalManager).toHaveBeenCalledTimes(1);
    });

    test('sets up metabolism manager', () => {
      const creature = new Creature('w-1');

      expect(MetabolismManager).toHaveBeenCalledTimes(1);
      expect(MetabolismManager).toHaveBeenCalledWith({
        personalityValues: creature.personality.values,
        maxMotive,
      });
    });

    test('sets up emotion manager', () => {
      new Creature('w-1');

      expect(EmotionManager).toHaveBeenCalledTimes(1);
    });
  });
});
