/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';
import { World } from '../../../src/world/World';
import { emotionList, motiveList } from '../../../src/defaults';

describe('debugManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => jest.restoreAllMocks());

  test('displays accurate creature outputs on init', () => {
    jest.spyOn(World.prototype, 'tick').mockImplementation(() => {});

    const el = document.createElement('div');
    const world = new World(el, {
      showStatus: true,
      showSliders: true,
      showPersonality: true,
    });

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

        const slider = motiveSliders[i].querySelector(
          `.slider-item-${motive} input`
        );
        expect(parseInt(slider.value)).toBe(motives[motive]);
      }

      const emotions = creature.getEmotions();
      for (let emotion in emotions) {
        const slider = emotionSliders[i].querySelector(
          `.slider-item-${emotion} input`
        );
        expect(parseInt(slider.value)).toBe(emotions[emotion]);
      }

      const personalityValues = creature.getPersonalityValues();
      for (let value in personalityValues) {
        const output = personalities[0].querySelector(
          `.personality-item-${value}`
        );
        expect(output.innerHTML).toBe(`${value}: ${personalityValues[value]}`);
      }

      const favoriteValues = creature.getFavorites();
      for (let value in favoriteValues) {
        const output = favorites[0].querySelector(`.personality-item-${value}`);
        expect(output.innerHTML).toBe(`${value}: ${favoriteValues[value]}`);
      }

      i++;
    });
  });

  test('displays accurate goal information on goal setting', () => {
    jest.spyOn(global, 'setInterval').mockImplementation(() => {});

    const el = document.createElement('div');
    const world = new World(el, { showStatus: true });
    world.tick();

    const creatures = world.getCreatures();
    const statusWrapper = world.getElement('statusWrapper');
    const statuses = statusWrapper.querySelectorAll('.status');

    let i = 0;
    creatures.forEach((creature) => {
      const goals = creature.goalManager.getGoals();
      const status = statuses[i];

      const table = status.querySelector('.status-item-goals table');
      const rows = table.querySelectorAll('tbody tr');
      expect(Object.keys(goals).length).toBe(rows.length);

      rows.forEach((row) => {
        const entries = Array.from(row.querySelectorAll('td')).map(
          (td) => td.textContent
        );
        const name = entries[0];
        const goal = goals[name];
        expect(entries).toEqual([
          name,
          JSON.stringify(goal.goalToken.priority),
          JSON.stringify(goal.goalToken.suspended),
          JSON.stringify(goal.goalToken.ticks),
          goal.goalToken.calledBy ? goal.goalToken.calledBy : '',
          goal.worldToken.target ? goal.worldToken.target : '',
        ]);
      });

      const currentGoal = creature.goalManager.getCurrentGoalName();
      const outputGoal = status.querySelector(
        '.status-item-currentGoalName output'
      );
      expect(outputGoal.innerHTML).toEqual(currentGoal);

      const outputPlan = status.querySelector('.status-item-plan output');
      expect(outputPlan.innerHTML).toMatch(/^plan.*$/);

      const outputState = status.querySelector('.status-item-state output');
      expect(outputState.innerHTML).toMatch(/^(state.*)?$/);

      i++;
    });
  });

  test('updates motive and emotion elements on change', () => {
    jest.spyOn(World.prototype, 'tick').mockImplementation(() => {});
    const el = document.createElement('div');
    const world = new World(el, {
      showStatus: true,
      showSliders: true,
    });

    const creatures = world.getCreatures();
    const statusWrapper = world.getElement('statusWrapper');
    const statuses = statusWrapper.querySelectorAll('.status');
    const motiveSliders = statusWrapper.querySelectorAll('.sliders-motives');
    const emotionSliders = statusWrapper.querySelectorAll('.sliders-emotions');

    let i = 0;
    creatures.forEach((creature) => {
      const fullness = creature.getMotive(motiveList.fullness);
      const happiness = creature.getEmotions()[emotionList.happy];

      const maxMotive = creature.getMaxMotive();
      const fullnessNew = fullness === maxMotive ? fullness - 1 : fullness + 1;
      const happinessNew =
        happiness === maxMotive ? happiness - 1 : happiness + 1;

      creature.setMotive(motiveList.fullness, fullnessNew);
      creature.emotionManager.setEmotion(
        creature,
        emotionList.happy,
        happinessNew
      );

      world.debugManager.updateCreatureStatus(creature);
      world.debugManager.updateCreatureSliders(creature);

      const status = statuses[i];
      const outputFullness = status.querySelector(
        `.status-item-${motiveList.fullness} output`
      );
      expect(parseInt(outputFullness.innerHTML)).not.toBe(fullness);
      expect(parseInt(outputFullness.innerHTML)).toBe(fullnessNew);

      const sliderFullness = motiveSliders[i].querySelector(
        `.slider-item-${motiveList.fullness} input`
      );
      expect(parseInt(sliderFullness.value)).not.toBe(fullness);
      expect(parseInt(sliderFullness.value)).toBe(fullnessNew);

      const sliderHappiness = emotionSliders[i].querySelector(
        `.slider-item-${emotionList.happy} input`
      );
      expect(parseInt(sliderHappiness.value)).not.toBe(happiness);
      expect(parseInt(sliderHappiness.value)).toBe(happinessNew);

      i++;
    });
  });

  test('updating sliders updates creature status', () => {
    jest.spyOn(World.prototype, 'tick').mockImplementation(() => {});
    const el = document.createElement('div');
    const world = new World(el, {
      showSliders: true,
    });

    const creatures = world.getCreatures();
    const statusWrapper = world.getElement('statusWrapper');
    const motiveSliders = statusWrapper.querySelectorAll('.sliders-motives');
    const emotionSliders = statusWrapper.querySelectorAll('.sliders-emotions');

    let i = 0;
    creatures.forEach((creature) => {
      const fullness = creature.getMotive(motiveList.fullness);
      const happiness = creature.getEmotions()[emotionList.happy];
      const maxMotive = creature.getMaxMotive();

      const sliderFullness = motiveSliders[i].querySelector(
        `.slider-item-${motiveList.fullness} input`
      );
      const fullnessNew = fullness === maxMotive ? fullness - 1 : fullness + 1;
      sliderFullness.value = fullnessNew;
      sliderFullness.dispatchEvent(new Event('change'));
      expect(creature.getMotive(motiveList.fullness)).not.toBe(fullness);
      expect(creature.getMotive(motiveList.fullness)).toBe(fullnessNew);

      const sliderHappiness = emotionSliders[i].querySelector(
        `.slider-item-${emotionList.happy} input`
      );
      const happinessNew =
        happiness === maxMotive ? happiness - 1 : happiness + 1;
      sliderHappiness.value = happinessNew;
      sliderHappiness.dispatchEvent(new Event('change'));
      expect(creature.getEmotions()[emotionList.happy]).not.toBe(happiness);
      expect(creature.getEmotions()[emotionList.happy]).toBe(happinessNew);

      i++;
    });
  });
});
