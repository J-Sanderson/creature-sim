/**
 * @jest-environment jsdom
 */

import { DebugManager } from '../../../src/managers/DebugManager';
import { worldBuilder } from '../../helpers/worldBuilder';
import { creatureBuilder } from '../../helpers/creatureBuilder';
import {
  personalityValueList,
  flavorList,
  colorList,
} from '../../../src/defaults';

describe('showCreaturePersonality', () => {
  let debugManager;
  let world;
  let creatures;

  beforeEach(() => {
    debugManager = new DebugManager();
    world = worldBuilder({
      entities: {
        items: [],
        creatures: [
          creatureBuilder({
            id: 'c-1',
            personalityByValue: {
              [personalityValueList.finickiness]: 50,
              [personalityValueList.independence]: 60,
              [personalityValueList.kindness]: 70,
            },
            favorites: { flavor: flavorList.chicken, color: colorList.black },
          }),
          creatureBuilder({
            id: 'c-2',
            personalityByValue: {
              [personalityValueList.liveliness]: 25,
              [personalityValueList.metabolism]: 35,
              [personalityValueList.naughtiness]: 45,
            },
            favorites: { flavor: flavorList.fish, color: colorList.blue },
          }),
        ],
      },
    });
    debugManager.showStatusWrapper(world);
    creatures = world.getCreatures();
    creatures.forEach((creature) => {
      debugManager.showCreaturePersonality(world, creature);
    });
  });

  describe('personality items', () => {
    test('appends paragraph element with personality class to status wrapper for each creature', () => {
      const personalityEls =
        world.elements.statusWrapper.querySelectorAll('.personality');
      expect(Array.from(personalityEls).length).toBe(creatures.size);
      personalityEls.forEach((personalityEl) => {
        expect(personalityEl).toBeInstanceOf(HTMLParagraphElement);
        expect(personalityEl.parentElement).toBe(world.elements.statusWrapper);
      });
    });

    test('appends spans to each personality paragraph for each creature personality value', () => {
      const personalityEls =
        world.elements.statusWrapper.querySelectorAll('.personality');
      let i = 0;
      creatures.forEach((creature) => {
        const personalityValueEls = personalityEls[i].querySelectorAll(
          '.personality-item.personality-item-personality'
        );
        const personalityValues = creature.getPersonalityValues();
        expect(Array.from(personalityValueEls).length).toBe(
          Object.keys(personalityValues).length
        );

        let j = 0;
        for (let personalityValue in personalityValues) {
          expect(personalityValueEls[j]).toBeInstanceOf(HTMLSpanElement);
          expect(personalityValueEls[j].innerHTML).toEqual(
            expect.stringContaining(
              `${personalityValue}: ${personalityValues[personalityValue]}`
            )
          );
          j++;
        }
        i++;
      });
    });
  });

  describe('favorites items', () => {
    test('appends paragraph element with favorites class to status wrapper for each creature', () => {
      const favoriteEls =
        world.elements.statusWrapper.querySelectorAll('.favorites');
      expect(Array.from(favoriteEls).length).toBe(creatures.size);
      favoriteEls.forEach((favoriteEl) => {
        expect(favoriteEl).toBeInstanceOf(HTMLParagraphElement);
        expect(favoriteEl.parentElement).toBe(world.elements.statusWrapper);
      });
    });

    test('appends spans to each favorite paragraph for each creature favorite', () => {
      const favoriteEls =
        world.elements.statusWrapper.querySelectorAll('.favorites');
      let i = 0;
      creatures.forEach((creature) => {
        const favoriteValueEls = favoriteEls[i].querySelectorAll(
          '.personality-item.personality-item-favorite'
        );
        const favoriteValues = creature.getFavorites();
        expect(Array.from(favoriteValueEls).length).toBe(
          Object.keys(favoriteValues).length
        );

        let j = 0;
        for (let favoriteValue in favoriteValues) {
          expect(favoriteValueEls[j]).toBeInstanceOf(HTMLSpanElement);
          expect(favoriteValueEls[j].innerHTML).toEqual(
            expect.stringContaining(
              `${favoriteValue}: ${favoriteValues[favoriteValue]}`
            )
          );
          j++;
        }
        i++;
      });
    });
  });

  test('all personality item spans are followed by a break element', () => {
    const personalityItems =
      world.elements.statusWrapper.querySelectorAll('.personality-item');
    personalityItems.forEach((personalityItem) => {
      const breakEl = personalityItem.nextSibling;
      expect(breakEl).toBeInstanceOf(HTMLBRElement);
    });
  });
});
