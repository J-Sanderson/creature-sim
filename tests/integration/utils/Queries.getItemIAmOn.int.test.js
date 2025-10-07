/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';
import { World } from '../../../src/world/World';
import Chicken from '../../../src/entities/items/Chicken';
import Steak from '../../../src/entities/items/Steak';
import { creatureBuilder } from '../../helpers/creatureBuilder';
import { queries } from '../../../src/utils/Queries';

describe('getItemIAmOn', () => {
  test('integrates Creature→WM→World→(item at creature position)', () => {
    const world = new World(document.createElement('div'));
    const chicken = world.addEntity(Chicken, { xPos: 5, yPos: 5 });
    world.addEntity(Steak, { xPos: 6, yPos: 6 });

    const selfOnItem = creatureBuilder({
      world: world.getGUID(),
      position: { x: 5, y: 5 },
    });

    const item = queries.getItemIAmOn(selfOnItem);
    expect(item.getGUID()).toEqual(chicken);
    expect(item).toBeInstanceOf(Chicken);
    expect(item).not.toBeInstanceOf(Steak);

    const selfNotOnItem = creatureBuilder({
      world: world.getGUID(),
      position: { x: 4, y: 4 },
    });
    const noItem = queries.getItemIAmOn(selfNotOnItem);
    expect(noItem).toBeUndefined();
  });
});
