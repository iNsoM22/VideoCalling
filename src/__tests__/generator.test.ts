const generator = require('../generator');

test('generates a random number within the specified range', () => {
    const result = generator.randomNumber(1, 10);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(10);
});

test('generates a random string of specified length', () => {
    const result = generator.randomString(5);
    expect(result).toHaveLength(5);
});

test('handles edge case for zero length string', () => {
    const result = generator.randomString(0);
    expect(result).toBe('');
});

test('generates a random boolean', () => {
    const result = generator.randomBoolean();
    expect(typeof result).toBe('boolean');
});