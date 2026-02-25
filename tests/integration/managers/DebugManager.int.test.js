/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';
import { World } from '../../../src/world/World';

describe('debugManager', () => {
  beforeEach(() => {
    jest.spyOn(World.prototype, 'tick').mockImplementation(() => {});
    jest.clearAllMocks();
  });
  afterEach(() => jest.restoreAllMocks());

  test('displays accurate creature outputs on init', () => {
    const el = document.createElement('div');
    const world = new World(el, { showStatus: true, showSliders: true, showPersonality: true });

    const creatures = world.getCreatures();
    const statusWrapper = world.getElement('statusWrapper');
    const statuses = statusWrapper.querySelectorAll('.status');
    const motiveSliders = statusWrapper.querySelectorAll('.sliders-motives');
    const emotionSliders = statusWrapper.querySelectorAll('.sliders-emotions');
    const personalities = statusWrapper.querySelectorAll('.personality');
    const favorites = statusWrapper.querySelectorAll('.favorites');

    let i = 0;
    creatures.forEach((creature) => {
      const status = statuses[i];

      const guid = creature.getGUID();
      expect(status.innerHTML).toEqual(
        expect.stringContaining(`Creature: ${guid}`)
      );

      // no current goals/plan/state on init
      const table = status.querySelector('.status-item-goals table');
      expect(table.querySelectorAll('thead')).toHaveLength(1);
      expect(table.querySelectorAll('tbody tr')).toHaveLength(0);

      ['currentGoalName', 'plan', 'state'].forEach((item) => {
        const output = status.querySelector(`.status-item-${item} output`);
        expect(output.innerHTML).toEqual('');
      });

      const motives = creature.getMotives();
      for (let motive in motives) {
        const output = status.querySelector(`.status-item-${motive} output`);
        expect(parseInt(output.innerHTML)).toBe(motives[motive]);

        const slider = motiveSliders[i].querySelector(`.slider-item-${motive} input`);
        expect(parseInt(slider.value)).toBe(motives[motive]);
      }

      const emotions = creature.getEmotions();
      for(let emotion in emotions) {
        const slider = emotionSliders[i].querySelector(`.slider-item-${emotion} input`);
        expect(parseInt(slider.value)).toBe(emotions[emotion]);
      }

      const personalityValues = creature.getPersonalityValues();
      for (let value in personalityValues) {
        const output = personalities[0].querySelector(`.personality-item-${value}`);
        expect(output.innerHTML).toBe(`${value}: ${personalityValues[value]}`);
      }

      const favoriteValues = creature.getFavorites();
      for(let value in favoriteValues) {
        const output = favorites[0].querySelector(`.personality-item-${value}`);
        expect(output.innerHTML).toBe(`${value}: ${favoriteValues[value]}`);
      }

      i++;
    });
  });
});
