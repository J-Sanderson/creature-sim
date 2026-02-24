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
      const world = new World(el, {showStatus: true});

      const creatures = world.getCreatures();
      const statusWrapper = world.getElement('statusWrapper');
      const statuses = statusWrapper.querySelectorAll('.status');

      let i = 0;
      creatures.forEach(creature => {
        const status = statuses[i];

        const guid = creature.getGUID();
        expect(status.innerHTML).toEqual(expect.stringContaining(`Creature: ${guid}`));

        // no current goals/plan/state on init
        // TODO better name goal outputs rather than using index
        const goalOutputs = status.querySelectorAll('.status-item.status-item-goal output');
        // TODO - update table layout to use thead/tbody and rewrite this to check for empty body.
        expect(goalOutputs[0].querySelector('table').querySelectorAll('tr')).toHaveLength(1);
        // TODO - improve after evaluating use of setVal, fold into below
        expect(goalOutputs[1].innerHTML).toEqual('""');
        ['plan', 'state'].forEach(item => {
          const output = status.querySelector(`.status-item-${item} output`);
          expect(output.innerHTML).toEqual('');
        });

        const motives = creature.getMotives();
        for (let motive in motives) {
          const output = status.querySelector(`.status-item-${motive} output`);
          expect(parseInt(output.innerHTML)).toBe(motives[motive]);
        }

        i++;
      });
    });
});
