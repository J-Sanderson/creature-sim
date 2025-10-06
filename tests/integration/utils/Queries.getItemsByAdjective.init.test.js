/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';

import { World } from '../../../src/world/World';
import TeddyBear from '../../../src/entities/items/TeddyBear';
import Bone from '../../../src/entities/items/Bone';
import { adjectiveList } from '../../../src/defaults';
import { queries } from '../../../src/utils/Queries';
import { creatureBuilder } from '../../helpers/creatureBuilder';

describe('getItemsByAdjective', () => {
  test('integrates WM→World→(item of requested adjective)', () => {
    const world = new World(document.createElement('div'));
    world.addEntity(TeddyBear, {xPos: 5, yPos: 5});
    world.addEntity(Bone, {xPos: 6, yPos: 6});

    const self = creatureBuilder({ world: world.getGUID() });
    const adjective = adjectiveList.soft;

    const items = queries.getItemsByAdjective(self, adjective);
    expect(items).toHaveLength(1);
    expect(items[0]).toBeInstanceOf(TeddyBear);
    expect(items[0]).not.toBeInstanceOf(Bone);
  });
});
