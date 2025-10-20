/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';
import { World } from '../../../src/world/World';
import Creature from '../../../src/entities/Creature';

describe('broadcast', () => {
  test('creates custom event type for each creature', () => {
    const eventName = 'event-1';
    const eventDetail = { detail: 'event-1-info' };
    const el = document.createElement('div');
    const world = new World(el);
    world.addEntity(Creature, { x: 0, y: 0 }, 'creatures');

    const listeners = [];
    world.getCreatures().forEach((creature) => {
      const icon = creature.getOutputs().icon;
      const fn = jest.fn();
      icon.addEventListener(eventName, fn);
      listeners.push(fn);
    });

    world.broadcast(eventName, eventDetail);

    listeners.forEach((fn) => {
      expect(fn).toHaveBeenCalledTimes(1);
      const ev = fn.mock.calls[0][0];
      expect(ev).toBeInstanceOf(CustomEvent);
      expect(ev.type).toBe(eventName);
      expect(ev.detail).toBe(eventDetail.detail);
    });
  });
});
