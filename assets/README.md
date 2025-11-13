# numberstowords

A javascript library to convert numbers to words. Supports both international and Indian convention.

## How to get it

### For browsers

#### Local use

From the [latest GitHub release](https://github.com/rajware/numberstowords/releases/latest), download **numberstowords.min.js** to your web site's js folder. Then, include it on an HTML page using a `<script>` tag.

```html
<script src="js/numberstowords.min.js"></script>
```

If you use Visual Studio Code and want code completion during development, download **numberstowords.d.ts** too. Then, you can get code completion in your own scripts by including a reference tag comment like this:

```javascript
/// <reference path="numberstowords.d.ts" />
```

#### CDN use

You can also use a CDN, instead of downloading locally. For example:

```html
<script src="https://unpkg.com/@rajware/numberstowords@latest/dist/numberstowords.min.js"></script>
```

For code completion, set the reference as follows:

```javascript
/// <reference path="https://unpkg.com/@rajware/numberstowords@latest/dist/numberstowords.d.ts" />
```

### For node

#### Install from npm
```bash
npm install --save @rajware/numberstowords
```
#### Use in CommonJS modules

```javascript
var numberstowords = require('@rajware/numberstowords');
```

#### Or, use in ESM modules
```javascript
import numberstowords from '@rajware/numberstowords';
```

## Example Usage

```javascript
var x = numberstowords.toIndianWords(123405); 
// x: one lakh twenty three thousand four hundred five

var x = numberstowords.toInternationalWords(123405);
// x: one hundred twenty three thousand four hundred five

var x = numberstowords.toIndianWords(123405, {useComma:true, useAnd:true});
// x: one lakh, twenty three thousand, four hundred and five

var x = numberstowords.toInternationalWords(123405, {useComma:true, useAnd:true});
// x: one hundred and twenty three thousand, four hundred and five

// Really large numbers
var x = numberstowords.toIndianWords(260000000000, {useComma:true, useAnd:true});
// x: twenty six thousand crore

var x = numberstowords.toInternationalWords(260000000000, {useComma:true, useAnd:true});
// x: nine hundred and ninety nine trillion, nine hundred and ninety nine billion, \
//    nine hundred and ninety nine million, nine hundred and ninety nine thousand, \
//    nine hundred and ninety nine

// Decimals are now allowed
var x = numberstowords.toIndianWords(26.67, {integerOnly:false});
// x: twenty six point six seven

// Rounded up to two decimal places by default. 
var x = numberstowords.toIndianWords(26.6764, {integerOnly:false});
// x: twenty six point six eight

// But can be rounded off to 0 to 10 decimal places. 
var x = numberstowords.toIndianWords(26.67648, {
                                                integerOnly:false,
                                                decimalPlaces: 4
                                              }
);
// x: twenty six point six seven six five

// You can use the 'currency format'
var x = numberstowords.toIndianWords(26.67, {
                                integerOnly:false, 
                                useCurrency: true,
                                majorCurrencySymbol: 'ringit',
                                minorCurrencySymbol: 'sen' });
// x: ringit twenty six and sixty seven sen

// With some control options
var x = numberstowords.toIndianWords(26.67, {
                                integerOnly:false, 
                                useCurrency: true,
                                majorCurrencySymbol: 'ringit',
                                minorCurrencySymbol: 'sen',
                                majorCurrencyAtEnd: true,
                                minorCurrencyAtEnd: false,
                                useOnlyWord: true,
                                useCase: 'proper' });
// x: Twenty Six Ringit And Sen Sixty Seven Only

// But this will always round off to two decimal places
// You can use the 'currency format'
var x = numberstowords.toIndianWords(26.67648, {
                                integerOnly:false, 
                                useCurrency: true,
                                majorCurrencySymbol: 'ringit',
                                minorCurrencySymbol: 'sen' });
// x: ringit twenty six and sixty eight sen

// We do negative numbers too
var x = numberstowords.toIndianWords(-26.67648, {
                                integerOnly:false, 
                                useCurrency: true,
                                majorCurrencySymbol: 'ringit',
                                minorCurrencySymbol: 'sen' });
// x: ringit minus twenty six and sixty eight sen

// You can see all options and their default values
var x = numberstowords.options;
/* x: { useComma: false,
        useAnd: false,
        useOnlyWord: false,
        integerOnly: true,
        decimalPlaces: 4,
        useCurrency: false,
        majorCurrencySymbol: 'rupees',
        minorCurrencySymbol: 'paise',
        majorCurrencyAtEnd: false,
        minorCurrencyAtEnd: true,
        suppressMajorIfZero: false,
        suppressMinorIfZero: false,
        useCase: 'lower' }
*/

// You can even change the default values.
// CAUTION: This is deprecated.
numberstowords.options.useCurrency = true;
// Now all calls will return currency format by default
var x = numberstowords.toInternationalWords(24);
// x: rupees twenty four

// You can change the words used for conversions
// as well.
// CAUTION: This is deprecated
numberstowords.words.smallAmountWords['hundred'] = 'sau';
numberstowords.words.smallAmountWords['thousand'] = 'hajjar';
numberstowords.words.unitWords[1] = 'ek';
numberstowords.words.andWord = 'aur';
var x = numberstowords.toWords(1201, {useAnd: true});
// x: ek hajjar two sau aur ek

// Default values can be reset.
// CAUTION: This is also deprecated.
numberstowords.resetOptions();
var x = numberstowords.toInternationalWords(24);
// x: twenty four

// The better way of doing things like the examples above
// is to pass the options to the methods, like this:
const words = numberstowords.defaultWords;
words.unitWords[1] = 'ek';
words.unitWords[2] = 'do';
words.andWord = 'aur';
words.smallAmountWords.hundred = 'sau';
words.smallAmountWords.thousand = 'hajjar';

var x = numberstowords.toWords(
    1201,
    {
        useAnd: true,
        useCurrency: true
    },
    words
);
// x: rupees ek hajjar do sau aur ek

```

