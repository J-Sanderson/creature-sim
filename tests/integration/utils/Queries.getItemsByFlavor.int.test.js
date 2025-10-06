/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';

import { World } from '../../../src/world/World';
import Chicken from '../../../src/entities/items/Chicken';
import Steak from '../../../src/entities/items/Steak';
import { flavorList } from '../../../src/defaults';
import { queries } from '../../../src/utils/Queries';
import { creatureBuilder } from '../../helpers/creatureBuilder';

describe('getItemsByFlavor', () => {
  test('integrates WM→World→(item of requested flavor)', () => {
    const world = new World(document.createElement('div'));
    world.addEntity(Chicken, { xPos: 5, yPos: 5 });
    world.addEntity(Steak, { xPos: 6, yPos: 6 });

    const self = creatureBuilder({ world: world.getGUID() });
    const flavor = flavorList.chicken;

    const items = queries.getItemsByFlavor(self, flavor);
    expect(items).toHaveLength(1);
    expect(items[0]).toBeInstanceOf(Chicken);
    expect(items[0]).not.toBeInstanceOf(Steak);
  });
});
