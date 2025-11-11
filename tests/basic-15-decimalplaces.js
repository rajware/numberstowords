import n from '../src/numberstowords.js';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

function assertDecimal(number, expected, places) {
  const result = n.toWords(number, { decimalPlaces: places, integerOnly: false });
  assert.equal(result, expected, `${number} (${places} places) → "${expected}", got "${result}"`);
}

describe('Decimal precision tests', () => {
  it("should handle 0 decimal places", () => {
    assertDecimal(42.99, 'forty two', 0);
    assertDecimal(0.75, 'zero', 0);
  });

  it("should handle 2 decimal places", () => {
    assertDecimal(1.234, 'one point two three', 2);
    assertDecimal(0.004, 'zero point zero zero', 2);
    assertDecimal(0.007, 'zero point zero one', 2);
    assertDecimal(1.5, 'one point five zero', 2);
    assertDecimal(1, 'one point zero zero', 2);
  });

  it("should handle 3 decimal places", () => {
    assertDecimal(1.234, 'one point two three four', 3);
    assertDecimal(0.007, 'zero point zero zero seven', 3);
  });

  it("should handle 6 decimal places", () => {
    assertDecimal(3.141593, 'three point one four one five nine three', 6);
    assertDecimal(0.000001, 'zero point zero zero zero zero zero one', 6);
  });
});
