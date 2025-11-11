import n from '../src/numberstowords.js';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

/**
 * 
 * @param {Number} number 
 * @param {string} expected 
 * @param {import('../src/numberstowords.mjs').numberstowords.Opts} opts 
 */
function assertNegative(number, expected, opts) {
  var result = n.toWords(number, opts);
  assert.equal(result, expected, `${number} should equal "${expected}", actually equals "${result}"`);
}

describe('Negative number tests', () => {
  it("should prefix with 'minus' for basic values", () => {
    assertNegative(-1, 'minus one');
    assertNegative(-19, 'minus nineteen');
    assertNegative(-99, 'minus ninety nine');
  });

  it("should work for hundreds and thousands", () => {
    assertNegative(-100, 'minus one hundred');
    assertNegative(-101, 'minus one hundred one');
    assertNegative(-999, 'minus nine hundred ninety nine');
    assertNegative(-1000, 'minus one thousand');
    assertNegative(-1101, 'minus one thousand one hundred one');
  });

  it("should work with decimal values", () => {
    assertNegative(-1.23, 'minus one point two three', { integerOnly: false });
    assertNegative(-0.5, 'minus zero point five zero', { integerOnly: false });
  });

  it("should work with currency formatting", () => {
    assertNegative(-2.25, 'rupees minus two and twenty five paise', { integerOnly: false, useCurrency: true });
    assertNegative(-0.75, 'rupees minus zero and seventy five paise', { integerOnly: false, useCurrency: true });
    assertNegative(-0.75, 'minus seventy five paise', { integerOnly: false, useCurrency: true, suppressMajorIfZero:true });
  });
});
