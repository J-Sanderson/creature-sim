import { utilities } from '../../src/utils/Utilities';

test('generateGUID produces dash-separated string', () => {
  const guid = utilities.generateGUID();
  expect(guid).toMatch(
    /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i
  );
});

describe('rand', () => {
  const max = 10;
  const result = utilities.rand(max);

  test('rand is an integer', () => {
    expect(Number.isInteger(result)).toBe(true);
  });

  test('rand is greater than or equal to 0', () => {
    expect(result).toBeGreaterThanOrEqual(0);
  });

  test('rand is less than or equal to max', () => {
    expect(result).toBeLessThanOrEqual(max);
  });
});
