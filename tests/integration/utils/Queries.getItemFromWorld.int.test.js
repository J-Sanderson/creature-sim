/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';

import { World } from '../../../src/world/World';
import Chicken from '../../../src/entities/items/Chicken';
import Steak from '../../../src/entities/items/Steak';
import { queries } from '../../../src/utils/Queries';
import { creatureBuilder } from '../../helpers/creatureBuilder';

describe('getItemFromWorld', () => {
  test('integrates WM→World→(requested item)', () => {
    const world = new World(document.createElement('div'));
    world.addEntity(Steak, { xPos: 5, yPos: 5 });
    const chicken = world.addEntity(Chicken, { xPos: 6, yPos: 6 });
    const self = creatureBuilder({ world: world.getGUID() });

    const item = queries.getItemFromWorld(self, chicken);
    expect(item.getGUID()).toEqual(chicken);
    expect(item).toBeInstanceOf(Chicken);
    expect(item).not.toBeInstanceOf(Steak);
  });
});
