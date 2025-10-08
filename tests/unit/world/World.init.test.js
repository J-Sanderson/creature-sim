/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';
import { World } from '../../../src/world/World';
import Creature from '../../../src/entities/Creature';
import { utilities } from '../../../src/utils/Utilities';
import items from '../../../src/entities/items';

jest.mock('../../../src/managers/WorldManager', () => ({
  __esModule: true,
  default: { addWorld: jest.fn() },
}));
jest.mock('../../../src/managers/DebugManager', () => {
  const instance = {
    showStatusWrapper: jest.fn(),
    showCreatureStatus: jest.fn(),
    updateCreatureStatus: jest.fn(),
    showCreatureSliders: jest.fn(),
    updateCreatureSliders: jest.fn(),
    showCreaturePersonality: jest.fn(),
  };
  const DebugManager = jest.fn(() => instance);
  return { __esModule: true, DebugManager };
});

beforeEach(() => jest.clearAllMocks());
afterEach(() => jest.restoreAllMocks());

describe('init', () => {
  describe('canvas setup', () => {     
    test('creates canvas elements and calls drawWorld', () => {
        jest.spyOn(World.prototype, 'drawWorld').mockImplementation(() => {});
        jest.spyOn(World.prototype, 'addEntity').mockImplementation(() => {});
        jest.spyOn(World.prototype, 'tick').mockImplementation(() => {});
        const el = document.createElement('div');
        const world = new World(el);

        expect(world.elements.canvasWrapper).toBeInstanceOf(HTMLDivElement);
        expect(world.elements.canvas).toBeInstanceOf(HTMLCanvasElement);

        expect(Array.from(world.elements.canvasWrapper.classList)).toContain(
        'world-wrapper'
        );
        expect(Array.from(world.elements.canvas.classList)).toContain(
        'world-canvas'
        );

        expect(world.elements.canvasWrapper.parentElement).toBe(
        world.elements.root
        );
        expect(world.elements.canvas.parentElement).toBe(
        world.elements.canvasWrapper
        );
    });

    test('sets world.ctx to canvas context', () => {
        jest.spyOn(World.prototype, 'drawWorld').mockImplementation(() => {});
        jest.spyOn(World.prototype, 'addEntity').mockImplementation(() => {});
        jest.spyOn(World.prototype, 'tick').mockImplementation(() => {});
        const el = document.createElement('div');
        const world = new World(el);

        expect(world.ctx).toBeInstanceOf(CanvasRenderingContext2D);
    });

    test('calls drawWorld after ctx set', () => {
        const drawWorld = jest
        .spyOn(World.prototype, 'drawWorld')
        .mockImplementation(() => {});
        jest.spyOn(World.prototype, 'addEntity').mockImplementation(() => {});
        jest.spyOn(World.prototype, 'tick').mockImplementation(() => {});
        const el = document.createElement('div');
        const world = new World(el);

        expect(world.ctx).toBeDefined();
        expect(drawWorld).toHaveBeenCalledTimes(1);
    });
  });

  describe('toybox setup', () => {
    test('creates toybox element', () => {
      jest.spyOn(World.prototype, 'drawWorld').mockImplementation(() => {});
      jest.spyOn(World.prototype, 'addEntity').mockImplementation(() => {});
      jest.spyOn(World.prototype, 'tick').mockImplementation(() => {});
      const el = document.createElement('div');
      const world = new World(el);

      expect(world.elements.toybox).toBeInstanceOf(HTMLDivElement);
      expect(Array.from(world.elements.toybox.classList)).toContain('toybox');
      expect(world.elements.toybox.parentElement).toBe(world.elements.root);
      expect(world.elements.toybox.dataset.world).toBe(world.guid);
    });

    test('creates toybox button element for each item', () => {
      jest.spyOn(World.prototype, 'drawWorld').mockImplementation(() => {});
      jest.spyOn(World.prototype, 'addEntity').mockImplementation(() => {});
      jest.spyOn(World.prototype, 'tick').mockImplementation(() => {});
      const el = document.createElement('div');
      const world = new World(el);

      items.forEach((item) => {
        const button = world.elements.toybox.querySelector(
          `#btn-${item.className}`
        );
        expect(button.parentElement).toBe(world.elements.toybox);
        expect(button).toBeInstanceOf(HTMLButtonElement);
        expect(
          `&#x${button.innerHTML.codePointAt(0).toString(16).toUpperCase()};`
        ).toBe(item.icon);
        expect(button.style['font-size']).toBe(`${world.params.cellSize}px`);
        ['adjectives', 'flavors', 'colors'].forEach((attribute) => {
          if (item[attribute]) {
            expect(button.dataset[attribute].split(',')).toEqual(item[attribute]);
          } else {
            expect(button.dataset[attribute]).toBe('');
          }
        });
      });

      expect(world.elements.toybox.querySelectorAll('button')).toHaveLength(
        items.length
      );
    });

    test('clicking toybox button fires toggleItem', () => {
      jest.spyOn(World.prototype, 'drawWorld').mockImplementation(() => {});
      jest.spyOn(World.prototype, 'addEntity').mockImplementation(() => {});
      jest.spyOn(World.prototype, 'tick').mockImplementation(() => {});
      const toggleItem = jest
        .spyOn(World.prototype, 'toggleItem')
        .mockImplementation(() => {});
      const el = document.createElement('div');
      const world = new World(el);

      items.forEach((item) => {
        const button = world.elements.toybox.querySelector(
          `#btn-${item.className}`
        );
        button.click();
        expect(toggleItem).toHaveBeenCalledTimes(1);
        expect(toggleItem).toHaveBeenCalledWith(button, item, false);
        toggleItem.mockClear();
      });
    });
  });

  describe('creature addition', () => {
    test('calls addEntity to place creature', () => {
      jest.spyOn(World.prototype, 'drawWorld').mockImplementation(() => {});
      const addEntity = jest
        .spyOn(World.prototype, 'addEntity')
        .mockImplementation(() => {});
      jest.spyOn(World.prototype, 'tick').mockImplementation(() => {});
      const x = 5;
      const y = 6;
      const randSpy = jest
        .spyOn(utilities, 'rand')
        .mockReturnValueOnce(x)
        .mockReturnValueOnce(y);
      const el = document.createElement('div');
      const world = new World(el);

      expect(randSpy).toHaveBeenNthCalledWith(1, world.params.width);
      expect(randSpy).toHaveBeenNthCalledWith(2, world.params.height);

      expect(addEntity).toHaveBeenCalledTimes(1);
      expect(addEntity).toHaveBeenCalledWith(
        Creature,
        {
          xPos: x,
          yPos: y,
        },
        'creatures'
      );
    });
  });

  describe('debug manager setup', () => {
    test('does not call debug manager functions by default', () => {
      jest.spyOn(World.prototype, 'drawWorld').mockImplementation(() => {});
      jest.spyOn(World.prototype, 'addEntity').mockImplementation(() => {});
      jest.spyOn(World.prototype, 'tick').mockImplementation(() => {});
      const el = document.createElement('div');
      const world = new World(el);

      [
        'showStatusWrapper',
        'showCreatureStatus',
        'updateCreatureStatus',
        'showCreatureSliders',
        'updateCreatureSliders',
        'showCreaturePersonality',
      ].forEach((func) => {
        expect(world.debugManager[func]).not.toHaveBeenCalled();
      });
    });

    test('calls debug manager status functions where specified', () => {
      jest.spyOn(World.prototype, 'drawWorld').mockImplementation(() => {});
      jest.spyOn(World.prototype, 'addEntity').mockImplementation(() => {});
      jest.spyOn(World.prototype, 'tick').mockImplementation(() => {});
      const el = document.createElement('div');
      const world = new World(el, { showStatus: true });

      expect(world.debugManager.showStatusWrapper).toHaveBeenCalledTimes(1);
      expect(world.debugManager.showStatusWrapper).toHaveBeenCalledWith(world);

      world.entities.creatures.forEach((creature) => {
        expect(world.debugManager.showCreatureStatus).toHaveBeenCalledTimes(1);
        expect(world.debugManager.showCreatureStatus).toHaveBeenCalledWith(
          world,
          creature
        );
        world.debugManager.showCreatureStatus.mockClear();

        expect(world.debugManager.updateCreatureStatus).toHaveBeenCalledTimes(1);
        expect(world.debugManager.updateCreatureStatus).toHaveBeenCalledWith(
          creature
        );
        world.debugManager.updateCreatureStatus.mockClear();
      });

      [
        'showCreatureSliders',
        'updateCreatureSliders',
        'showCreaturePersonality',
      ].forEach((func) => {
        expect(world.debugManager[func]).not.toHaveBeenCalled();
      });
    });

    test('calls debug manager slider functions where specified', () => {
      jest.spyOn(World.prototype, 'drawWorld').mockImplementation(() => {});
      jest.spyOn(World.prototype, 'addEntity').mockImplementation(() => {});
      jest.spyOn(World.prototype, 'tick').mockImplementation(() => {});
      const el = document.createElement('div');
      const world = new World(el, { showSliders: true });

      world.entities.creatures.forEach((creature) => {
        expect(world.debugManager.showCreatureSliders).toHaveBeenCalledTimes(1);
        expect(world.debugManager.showCreatureSliders).toHaveBeenCalledWith(
          world,
          creature
        );
        world.debugManager.showCreatureSliders.mockClear();

        expect(world.debugManager.updateCreatureSliders).toHaveBeenCalledTimes(1);
        expect(world.debugManager.updateCreatureSliders).toHaveBeenCalledWith(
          creature
        );
        world.debugManager.updateCreatureSliders.mockClear();
      });

      [
        'showStatusWrapper',
        'showCreatureStatus',
        'updateCreatureStatus',
        'showCreaturePersonality',
      ].forEach((func) => {
        expect(world.debugManager[func]).not.toHaveBeenCalled();
      });
    });

    test('calls debug manager personality functions where specified', () => {
      jest.spyOn(World.prototype, 'drawWorld').mockImplementation(() => {});
      jest.spyOn(World.prototype, 'addEntity').mockImplementation(() => {});
      jest.spyOn(World.prototype, 'tick').mockImplementation(() => {});
      const el = document.createElement('div');
      const world = new World(el, { showPersonality: true });

      world.entities.creatures.forEach((creature) => {
        expect(world.debugManager.showCreaturePersonality).toHaveBeenCalledTimes(
          1
        );
        expect(world.debugManager.showCreaturePersonality).toHaveBeenCalledWith(
          world,
          creature
        );
        world.debugManager.showCreaturePersonality.mockClear();
      });

      [
        'showStatusWrapper',
        'showCreatureStatus',
        'updateCreatureStatus',
        'showCreatureSliders',
        'updateCreatureSliders',
      ].forEach((func) => {
        expect(world.debugManager[func]).not.toHaveBeenCalled();
      });
    });
  });

  describe('timer setup', () => {
    test('sets up timer with correct parameter', () => {
      jest.spyOn(World.prototype, 'drawWorld').mockImplementation(() => {});
      jest.spyOn(World.prototype, 'addEntity').mockImplementation(() => {});
      jest.spyOn(World.prototype, 'tick').mockImplementation(() => {});
      const setInterval = jest.spyOn(global, 'setInterval');

      const el = document.createElement('div');
      const speed = 100;
      const world = new World(el, {speed});

      expect(setInterval).toHaveBeenCalledTimes(1);
      expect(setInterval).toHaveBeenCalledWith(expect.any(Function), speed);
      expect(world.motion).toBeDefined();
    });

    test('calls tick function by timer', () => {
      jest.useFakeTimers(); 
      jest.spyOn(World.prototype, 'drawWorld').mockImplementation(() => {});
      jest.spyOn(World.prototype, 'addEntity').mockImplementation(() => {});
      const tick = jest.spyOn(World.prototype, 'tick').mockImplementation(() => {});
      const el = document.createElement('div');
      const speed = 100;
      const world = new World(el, {speed});

      expect(world.motion).toBeDefined();
      expect(tick).not.toHaveBeenCalled();

      for (let i = 1; i <= 3; i++) {
          jest.advanceTimersByTime(speed);
          expect(tick).toHaveBeenCalledTimes(i);
      }
    });
  });
});
