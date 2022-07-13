const { reverse } = require('../utils/for_testing');

describe('reverse', () => {
  test('of a is a', () => {
    const result = reverse('a');
    expect(result).toBe('a');
  });

  test('of react is tcaer', () => {
    const result = reverse('react');
    expect(result).toBe('tcaer');
  });

  test('of releveler is releveler', () => {
    const result = reverse('releveler');
    expect(result).toBe('releveler');
  })
});