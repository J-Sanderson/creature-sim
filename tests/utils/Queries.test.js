import { motiveList, personalityValueList } from '../../src/defaults';
import { selfBuilder } from '../builders/selfBuilder';
import { queries } from '../../src/utils/Queries';

describe('amIThirsty', () => {
    test('returns false if threshold is falsy', () => {
        const self = selfBuilder({});
        expect(queries.amIThirsty(self)).toBe(false);
    });

    test('returns true if hydration is below threshold', () => {
        const self = selfBuilder({
            thresholdByMotive: { [motiveList.hydration]: 50},
            motiveByMotive: { [motiveList.hydration]: 49 },
        });
        expect(queries.amIThirsty(self)).toBe(true);
    });

    test('returns false if hydration is equal to threshold', () => {
        const self = selfBuilder({
            thresholdByMotive: { [motiveList.hydration]: 50},
            motiveByMotive: { [motiveList.hydration]: 50 },
        });
        expect(queries.amIThirsty(self)).toBe(false);
    });

    test('returns false if hydration is greater than threshold', () => {
        const self = selfBuilder({
            thresholdByMotive: { [motiveList.hydration]: 50},
            motiveByMotive: { [motiveList.hydration]: 51 },
        });
        expect(queries.amIThirsty(self)).toBe(false);
    });
});

describe('amITired', () => {
    test('returns false if threshold is falsy', () => {
        const self = selfBuilder({
            thresholdByMotive: {},
            motiveByMotive: {}
        });
        expect(queries.amITired(self)).toBe(false);
    });

    test('returns true if energy is below threshold', () => {
        const self = selfBuilder({
            thresholdByMotive: { [motiveList.energy]: 50},
            motiveByMotive: { [motiveList.energy]: 49 },
        });
        expect(queries.amITired(self)).toBe(true);
    });

    test('returns false if energy is equal to threshold', () => {
        const self = selfBuilder({
            thresholdByMotive: { [motiveList.energy]: 50},
            motiveByMotive: { [motiveList.energy]: 50 },
        });
        expect(queries.amITired(self)).toBe(false);
    });

    test('returns false if energy is greater than threshold', () => {
        const self = selfBuilder({
            thresholdByMotive: { [motiveList.energy]: 50},
            motiveByMotive: { [motiveList.energy]: 51 },
        });
        expect(queries.amITired(self)).toBe(false);
    });
});

describe('amIFinicky', () => {
    test('returns false if finickiness is falsy', () => {
        const self = selfBuilder({});
        expect(queries.amIFinicky(self)).toBe(false);
    });

    test('returns false if maxMotive is falsy', () => {
        const self = selfBuilder({
            personalityByValue: {[personalityValueList.finickiness]: 25},
            maxMotive: 0,
        });
        expect(queries.amIFinicky(self)).toBe(false);
    });

    test('returns false if random roll is greater than ratio', () => {
        const self = selfBuilder({
            personalityByValue: {[personalityValueList.finickiness]: 25},
            maxMotive: 100,
        });

        const spy = jest.spyOn(Math, 'random').mockReturnValue(0.3);
        expect(queries.amIFinicky(self)).toBe(false);
        spy.mockRestore();
    });

    test('returns true if random roll is equal to ratio', () => {
        const self = selfBuilder({
            personalityByValue: {[personalityValueList.finickiness]: 25},
            maxMotive: 100,
        });

        const spy = jest.spyOn(Math, 'random').mockReturnValue(0.25);
        expect(queries.amIFinicky(self)).toBe(true);
        spy.mockRestore();
    });

    test('returns true if random roll is less than ratio', () => {
        const self = selfBuilder({
            personalityByValue: {[personalityValueList.finickiness]: 25},
            maxMotive: 100,
        });

        const spy = jest.spyOn(Math, 'random').mockReturnValue(0.2);
        expect(queries.amIFinicky(self)).toBe(true);
        spy.mockRestore();
    });
});