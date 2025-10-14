/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';
import { World } from '../../../src/world/World';

const dispatchableCreature = () => {
  const icon = document.createElement('div');
  return {
    icon,
    dispatchSpy: jest.spyOn(icon, 'dispatchEvent'),
    getOutputs() {
      return { icon };
    },
  };
};

describe('broadcast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(World.prototype, 'init').mockImplementation(function () {});
  });
  afterEach(() => jest.restoreAllMocks());

  test('dispatches event to all creatures', () => {
    const creature1 = dispatchableCreature();
    const creature2 = dispatchableCreature();
    // todo make this a map
    const creatures = [creature1, creature2];
    jest.spyOn(World.prototype, 'getCreatures').mockReturnValue(creatures);

    const eventName = 'event-1';
    const eventDetail = { detail: 'event-1-info' };
    const el = document.createElement('div');
    const world = new World(el);

    world.broadcast(eventName, eventDetail);
    creatures.forEach((creature) => {
      expect(creature.dispatchSpy).toHaveBeenCalledTimes(1);
      const ev = creature.dispatchSpy.mock.calls[0][0];
      expect(ev).toBeInstanceOf(CustomEvent);
      expect(ev.type).toBe(eventName);
      expect(ev.detail).toBe(eventDetail.detail);
    });

    expect(creatures[0].dispatchSpy.mock.calls[0][0]).not.toBe(
      creatures[1].dispatchSpy.mock.calls[0][0]
    );
  });
});
