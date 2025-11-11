import n from '../src/numberstowords.js';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

/**
 * 
 * @param {Number} number 
 * @param {string} expected 
 * @param {import('../src/numberstowords.mjs').numberstowords.Opts} opts
 * @param {import('../src/numberstowords.mjs').numberstowords.Words} words 
 */
function assertCustomWords(number, expected, opts, words) {
    var result = n.toWords(number, opts, words);
    assert.equal(result, expected, `${number} should equal "${expected}", actually equals "${result}"`);
}

describe('Custom Words tests', () => {
    it("should override 'and' word", () => {
        assertCustomWords(101, 'one hundred plus one', { useAnd: true }, { andWord: 'plus' });
    });

    it("should override 'point' word", () => {
        assertCustomWords(1.5, 'one dot five', { integerOnly: false, decimalPlaces: 1 }, { pointWord: 'dot' });
    });

    it("should override 'only' word", () => {
        assertCustomWords(42, 'forty two exclusively', { useOnlyWord: true }, { onlyWord: 'exclusively' });
    });

    it("should override 'negative' word", () => {
        assertCustomWords(-3, 'minus three', {}, { negativeWord: 'minus' });
        assertCustomWords(-3, 'negativo three', {}, { negativeWord: 'negativo' });
    });

    it("should override unit words", () => {
        const spanishUnits = [
            'cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco',
            'seis', 'siete', 'ocho', 'nueve', 'diez',
            'once', 'doce', 'trece', 'catorce', 'quince',
            'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'
        ];
        assertCustomWords(3, 'tres', {}, { unitWords: spanishUnits });
        assertCustomWords(13, 'trece', {}, { unitWords: spanishUnits });
    });

    it("should override tenWords", () => {
        const frenchTens = [undefined, undefined, 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];
        assertCustomWords(20, 'vingt', undefined, { tenWords: frenchTens });
        assertCustomWords(21, 'vingt one', undefined, { tenWords: frenchTens });
        assertCustomWords(99, 'quatre-vingt-dix nine', undefined, { tenWords: frenchTens });
    });

    it("should override bigAmountWords for international style", () => {
        const germanBig = {
            million: 'Millionen',
            billion: 'Milliarden',
            trillion: 'Billionen'
        };
        assertCustomWords(1000000, 'one Millionen', { useIndianStyle: false }, { bigAmountWords: germanBig });
        assertCustomWords(1000000000, 'one Milliarden', { useIndianStyle: false }, { bigAmountWords: germanBig });
    });

    it("should override bigAmountWords for Indian style", () => {
        const hindiBig = {
            lakh: 'लाख',
            crore: 'करोड़'
        };
        assertCustomWords(100000, 'one लाख', undefined, { bigAmountWords: hindiBig });
        assertCustomWords(10000000, 'one करोड़', undefined, { bigAmountWords: hindiBig });
    });

    it("should override currency symbols", () => {
        assertCustomWords(42, 'euros forty two', { useCurrency: true, majorCurrencySymbol: 'euros' });
        assertCustomWords(42.75, 'euros forty two and seventy five cents', {
            useCurrency: true,
            majorCurrencySymbol: 'euros',
            minorCurrencySymbol: 'cents',
            integerOnly: false
        });
        assertCustomWords(0.5, 'euros zero and fifty cents', {
            useCurrency: true,
            majorCurrencySymbol: 'euros',
            minorCurrencySymbol: 'cents',
            integerOnly: false
        });
    });
});
