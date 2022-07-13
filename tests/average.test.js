const { average } = require('../utils/for_testing');

describe ('average', () => {
  test('of one value is the value itself', () => {
    expect(average([5])).toBe(5);
  });

  test('of many is calculated correctly', () => {
    expect(average([3, 6, 9])).toBe(6);
  });

  test('of empty array is zero', () => {
    expect(average([])).toBe(0);
  })
});