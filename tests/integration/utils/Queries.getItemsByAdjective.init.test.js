/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';

import { World } from "../../../src/world/World";
import TeddyBear from '../../../src/entities/items/TeddyBear';
import Bone from '../../../src/entities/items/Bone';
import { adjectiveList } from '../../../src/defaults';
import { queries } from '../../../src/utils/Queries';
import { creatureBuilder } from '../../helpers/creatureBuilder';

describe('getItemsByAdjective', () => {
    test('integrates WM→World→(item of requested adjective)', () => {
        const adjective = adjectiveList.soft;
        const world = new World(document.createElement('div'));
        const button1 = document.createElement('button');
        button1.dataset.adjectives = TeddyBear.adjectives.join();
        const button2 = document.createElement('button');
        button2.dataset.adjectives = Bone.adjectives.join();

        world.toggleItem(button1, TeddyBear);
        world.toggleItem(button2, Bone);

        const self = creatureBuilder({ world: world.getGUID() });

        const items = queries.getItemsByAdjective(self, adjective);
        expect(items).toHaveLength(1);
        expect(items[0]).toBeInstanceOf(TeddyBear);
        expect(items[0]).not.toBeInstanceOf(Bone);
    });
});