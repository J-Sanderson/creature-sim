/**
 * @jest-environment jsdom
 */

import { DebugManager } from '../../../src/managers/DebugManager';
import { worldBuilder } from '../../helpers/worldBuilder';
import { creatureBuilder } from '../../helpers/creatureBuilder';
import { motiveList, emotionList } from '../../../src/defaults';

describe('showCreatureSliders', () => {
  let debugManager;
  let world;
  let creatures;

  const maxMotive = 100;

  beforeEach(() => {
    debugManager = new DebugManager();
    world = worldBuilder({
      entities: {
        items: [],
        creatures: [
          creatureBuilder({
            id: 'c-1',
            motiveByMotive: {
              [motiveList.hydration]: 50,
              [motiveList.fullness]: 60,
              [motiveList.energy]: 70,
            },
            emotionByValue: {
              [emotionList.angry]: 10,
              [emotionList.happy]: 20,
              [emotionList.sad]: 30,
            },
          }),
          creatureBuilder({
            id: 'c-2',
            motiveByMotive: {
              [motiveList.hydration]: 50,
              [motiveList.fullness]: 60,
              [motiveList.energy]: 70,
            },
            emotionByValue: {
              [emotionList.angry]: 10,
              [emotionList.happy]: 20,
              [emotionList.sad]: 30,
            },
          }),
        ],
      },
    });
    world.params = { maxMotive };
    debugManager.showStatusWrapper(world);
    creatures = world.getCreatures();
    creatures.forEach((creature) => {
      jest.spyOn(creature, 'setOutputEl').mockImplementation(() => {});
      jest.spyOn(creature, 'setMotive').mockImplementation(() => {});
      jest
        .spyOn(creature.emotionManager, 'setEmotion')
        .mockImplementation(() => {});
      debugManager.showCreatureSliders(world, creature);
    });
  });

  describe('slider elements', () => {
    let sliderItems;
    beforeEach(() => {
      sliderItems =
        world.elements.statusWrapper.querySelectorAll('.slider-item');
    });
    test('each slider item contains a range input', () => {
      sliderItems.forEach((sliderItem) => {
        const range = sliderItem.querySelector('input');
        expect(range).toBeInstanceOf(HTMLInputElement);
        expect(range.type).toBe('range');
        expect(range.parentElement).toBe(sliderItem);
      });
    });

    test('range inputs minimums are 0', () => {
      sliderItems.forEach((sliderItem) => {
        const range = sliderItem.querySelector('input');
        expect(parseInt(range.getAttribute('min'))).toBe(0);
      });
    });

    test('range inputs maximums are maxMotive', () => {
      sliderItems.forEach((sliderItem) => {
        const range = sliderItem.querySelector('input');
        expect(parseInt(range.getAttribute('max'))).toBe(maxMotive);
      });
    });

    test('range inputs steps are 1', () => {
      sliderItems.forEach((sliderItem) => {
        const range = sliderItem.querySelector('input');
        expect(parseInt(range.getAttribute('step'))).toBe(1);
      });
    });
  });

  describe('motive sliders', () => {
    test('appends fieldset element with motive slider class to status wrapper for each creature', () => {
      const fieldsets = world.elements.statusWrapper.querySelectorAll(
        '.sliders.sliders-motives'
      );
      expect(Array.from(fieldsets).length).toBe(creatures.size);
      fieldsets.forEach((fieldset) => {
        expect(fieldset).toBeInstanceOf(HTMLFieldSetElement);
        expect(fieldset.parentElement).toBe(world.elements.statusWrapper);
      });
    });

    test('appends slider item spans to motive fieldset', () => {
      const fieldsets = world.elements.statusWrapper.querySelectorAll(
        '.sliders.sliders-motives'
      );

      let i = 0;
      creatures.forEach((creature) => {
        const fieldset = fieldsets[i];
        const sliderItems = fieldset.querySelectorAll(
          '.slider-item.slider-item-motive'
        );

        const motives = creature.getMotives();
        expect(Array.from(sliderItems).length).toBe(
          Object.keys(motives).length
        );

        sliderItems.forEach((sliderItem) => {
          expect(sliderItem).toBeInstanceOf(HTMLSpanElement);
          expect(sliderItem.parentElement).toBe(fieldset);
        });
        i++;
      });
    });

    test('initialises motive sliders with current motive values', () => {
      const fieldsets = world.elements.statusWrapper.querySelectorAll(
        '.sliders.sliders-motives'
      );

      let i = 0;
      creatures.forEach((creature) => {
        const fieldset = fieldsets[i];
        const sliderItems = fieldset.querySelectorAll(
          '.slider-item.slider-item-motive'
        );

        const motives = creature.getMotives();

        let j = 0;
        for (let motive in motives) {
          const range = sliderItems[j].querySelector('input');
          expect(parseInt(range.value)).toBe(motives[motive]);
          j++;
        }
        i++;
      });
    });

    test('slider item motive spans contains motive name', () => {
      const fieldsets = world.elements.statusWrapper.querySelectorAll(
        '.sliders.sliders-motives'
      );

      let i = 0;
      creatures.forEach((creature) => {
        const fieldset = fieldsets[i];
        const sliderItems = fieldset.querySelectorAll(
          '.slider-item.slider-item-motive'
        );

        const motives = creature.getMotives();

        let j = 0;
        for (let motive in motives) {
          expect(sliderItems[j].innerHTML).toEqual(
            expect.stringContaining(motive)
          );
          j++;
        }
        i++;
      });
    });

    test('calls creature.setOutputEl for each creature and motive with motive name and slider element', () => {
      const fieldsets = world.elements.statusWrapper.querySelectorAll(
        '.sliders.sliders-motives'
      );

      let i = 0;
      creatures.forEach((creature) => {
        const fieldset = fieldsets[i];
        const sliderItems = fieldset.querySelectorAll(
          '.slider-item.slider-item-motive'
        );

        const motives = creature.getMotives();

        let j = 0;
        for (let motive in motives) {
          const range = sliderItems[j].querySelector('input');
          expect(creature.setOutputEl).toHaveBeenCalledWith(
            `slider-${motive}`,
            range
          );
          j++;
        }
        i++;
      });
    });

    test('calls creature.setMotive on motive slider change', () => {
      const fieldsets = world.elements.statusWrapper.querySelectorAll(
        '.sliders.sliders-motives'
      );

      let i = 0;
      creatures.forEach((creature) => {
        const fieldset = fieldsets[i];
        const sliderItems = fieldset.querySelectorAll(
          '.slider-item.slider-item-motive'
        );

        const motives = creature.getMotives();

        let j = 0;
        for (let motive in motives) {
          const range = sliderItems[j].querySelector('input');
          range.dispatchEvent(new Event('change'));
          expect(creature.setMotive).toHaveBeenCalledWith(
            motive,
            expect.any(Number)
          );
          j++;
        }
        i++;
      });
    });
  });

  describe('emotion sliders', () => {
    test('appends fieldset element with emotion slider class to status wrapper for each creature', () => {
      const fieldsets = world.elements.statusWrapper.querySelectorAll(
        '.sliders.sliders-emotions'
      );
      expect(Array.from(fieldsets).length).toBe(creatures.size);
      fieldsets.forEach((fieldset) => {
        expect(fieldset).toBeInstanceOf(HTMLFieldSetElement);
        expect(fieldset.parentElement).toBe(world.elements.statusWrapper);
      });
    });

    test('appends slider item spans to emotion fieldset', () => {
      const fieldsets = world.elements.statusWrapper.querySelectorAll(
        '.sliders.sliders-emotions'
      );

      let i = 0;
      creatures.forEach(() => {
        const fieldset = fieldsets[i];
        const sliderItems = fieldset.querySelectorAll(
          '.slider-item.slider-item-emotion'
        );
        sliderItems.forEach((sliderItem) => {
          expect(sliderItem).toBeInstanceOf(HTMLSpanElement);
          expect(sliderItem.parentElement).toBe(fieldset);
        });
        i++;
      });
    });

    test('initialises emotion sliders with current emotion values', () => {
      const fieldsets = world.elements.statusWrapper.querySelectorAll(
        '.sliders.sliders-emotions'
      );

      let i = 0;
      creatures.forEach((creature) => {
        const fieldset = fieldsets[i];
        const sliderItems = fieldset.querySelectorAll(
          '.slider-item.slider-item-emotion'
        );

        const emotions = creature.getEmotions();

        let j = 0;
        for (let emotion in emotions) {
          const range = sliderItems[j].querySelector('input');
          expect(parseInt(range.value)).toBe(emotions[emotion]);
          j++;
        }
        i++;
      });
    });

    test('slider item emotion spans contains emotion name', () => {
      const fieldsets = world.elements.statusWrapper.querySelectorAll(
        '.sliders.sliders-emotions'
      );

      let i = 0;
      creatures.forEach((creature) => {
        const fieldset = fieldsets[i];
        const sliderItems = fieldset.querySelectorAll(
          '.slider-item.slider-item-emotion'
        );

        const emotions = creature.getEmotions();

        let j = 0;
        for (let emotion in emotions) {
          expect(sliderItems[j].innerHTML).toEqual(
            expect.stringContaining(emotion)
          );
          j++;
        }
        i++;
      });
    });

    test('calls creature.setOutputEl for each creature and emotion with emotion name and slider element', () => {
      const fieldsets = world.elements.statusWrapper.querySelectorAll(
        '.sliders.sliders-emotions'
      );

      let i = 0;
      creatures.forEach((creature) => {
        const fieldset = fieldsets[i];
        const sliderItems = fieldset.querySelectorAll(
          '.slider-item.slider-item-emotion'
        );

        const emotions = creature.getEmotions();

        let j = 0;
        for (let emotion in emotions) {
          const range = sliderItems[j].querySelector('input');
          expect(creature.setOutputEl).toHaveBeenCalledWith(
            `slider-${emotion}`,
            range
          );
          j++;
        }
        i++;
      });
    });

    test('calls creature.setEmotion on emotion slider change', () => {
      const fieldsets = world.elements.statusWrapper.querySelectorAll(
        '.sliders.sliders-emotions'
      );

      let i = 0;
      creatures.forEach((creature) => {
        const fieldset = fieldsets[i];
        const sliderItems = fieldset.querySelectorAll(
          '.slider-item.slider-item-emotion'
        );

        const emotions = creature.getEmotions();

        let j = 0;
        for (let emotion in emotions) {
          const range = sliderItems[j].querySelector('input');
          range.dispatchEvent(new Event('change'));
          expect(creature.emotionManager.setEmotion).toHaveBeenCalledWith(
            creature,
            emotion,
            expect.any(Number)
          );
          j++;
        }
        i++;
      });
    });
  });
});
