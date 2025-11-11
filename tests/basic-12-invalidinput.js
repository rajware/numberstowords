import n from '../src/numberstowords.js';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

function assertThrowsNumber(number, message) {
    assert.throws(() => {
        n.toWords(number);
    }, {
        name: 'NumbersToWordsError',
        message
    });
}

function assertThrowsOpts(number, opts, message) {
    assert.throws(() => {
        n.toWords(number, opts);
    }, {
        name: 'NumbersToWordsError',
        message
    });
}

describe('Error handling tests', () => {
    it("should throw for non-numeric input", () => {
        assertThrowsNumber(undefined, 'Invalid number: undefined');
        assertThrowsNumber(null, 'Invalid number: null');
        assertThrowsNumber('abc', 'Invalid number: abc');
        assertThrowsNumber(NaN, 'Invalid number: NaN');
        assertThrowsNumber(Infinity, 'Invalid number: Infinity');
    });

    it("should throw for non-object options", () => {
        assertThrowsOpts(42, 'string', 'Options must be an object');
        assertThrowsOpts(42, 123, 'Options must be an object');
        assertThrowsOpts(42, true, 'Options must be an object');
    });

    it("should throw for invalid useCase values", () => {
        assertThrowsOpts(42, { useCase: 'camel' }, 'Invalid useCase: camel');
        assertThrowsOpts(42, { useCase: 'LOWERCASE' }, 'Invalid useCase: LOWERCASE');
    });

    it("should throw for non-string currency symbols", () => {
        assertThrowsOpts(42, { majorCurrencySymbol: 123 }, 'majorCurrencySymbol must be a string');
        assertThrowsOpts(42, { minorCurrencySymbol: false }, 'minorCurrencySymbol must be a string');
    });
});
