/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';
import { World } from '../../../src/world/World';
import Chicken from '../../../src/entities/items/Chicken';
import Steak from '../../../src/entities/items/Steak';
import Creature from '../../../src/entities/Creature';
import { queries } from '../../../src/utils/Queries';

describe('amIOnItem', () => {
  test('integrates Creature→WM→World→(requested item)', () => {
    const world = new World(document.createElement('div'));
    const steak = world.addEntity(Steak, { xPos: 5, yPos: 5 });
    const chicken = world.addEntity(Chicken, { xPos: 6, yPos: 6 });
    const creature = world.addEntity(
      Creature,
      { xPos: 6, yPos: 6 },
      'creatures'
    );
    const self = world.getCreature(creature);

    expect(queries.amIOnItem(self, chicken)).toBe(true);
    expect(queries.amIOnItem(self, steak)).toBe(false);
  });
});
