import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import n from '../src/numberstowords.js';

function assertWithSettings(number, word) {
  var testvalue = n.toWords(number);
  assert.equal(testvalue, word, `${number} should equal "${word}", actually equals "${testvalue}"`);
}

describe('Setting and resetting options', () => {
  it('Should work while setting options', () => {
    n.words.smallAmountWords['hundred'] = 'sau';
    n.words.smallAmountWords['thousand'] = 'hajjar';
    n.words.unitWords[1] = 'ek';
    n.words.andWord = 'aur';
    n.options.useAnd = true;

    assertWithSettings(1201, 'ek hajjar two sau aur ek');
    assertWithSettings(12001, 'twelve hajjar aur ek');
  });

  it('Should work after resetting options', () => {
    n.resetOptions();

    assertWithSettings(1200, 'one thousand two hundred');
    assertWithSettings(12001, 'twelve thousand one');
  });

});
