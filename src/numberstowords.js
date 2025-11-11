/**
 * The Opts object defines options available while converting to words.
 * @typedef {Object} Opts
 * @property {boolean} integerOnly - if true, rounds up number to the nearest integer before converting. If false,
 * converts decimal numbers like this: 1.12 becomes 'one point one two', unless the useCurrency option is true.
 * Default: true.
 * @property {Number} decimalPlaces - If intergerOnly is false, considers up to this many decimal places for 
 * conversion. Can be a number between 0 and 10, both inclusive. Setting decimalPlaces to 0 is the same as
 * setting integerOnly to true - therefore,  decimals will be truncated, not rounded. Ignored when useCurrency
 * is true, in which case decimal places is fixed at 2. Default: 2.
 * @property {boolean} useComma - if true, puts a comma after each "large" number group. E.g. 1101 becomes 'one
 * thousand, one hundred one'. Default: false.
 * @property {boolean} useAnd - if true, puts the 'and' word between hundreds and unit words. Eg. 1101 becomes 'one
 * thousand, one hundred and one'. Default: false.
 * @property {boolean} useOnlyWord - if true, puts the 'only' word at the end. Eg. 12 becomes 'twelve only'.
 * Default: false.
 * @property {boolean} useIndianStyle - if true, numbers greater than 99999 are grouped using the Indian units lakhs
 * and crores. If false, they are grouped using millions, billions and trillions. Default: true.
 * @property {boolean} useCurrency - if true, uses the major (and minor if integerOnly is false) currency symbols as
 * described below. Note that if integerOnly is set to false, decimals are rounded off to 2 decimal places only. The
 * value of the decimalPlaces property is ignored for the currentcy format. Default: false.
 * @property {string} majorCurrencySymbol - the major currency symbol, like 'dollar' or 'ringgit'. Default:
 * 'rupees'.
 * @property {string} minorCurrencySymbol - the minor currency symbols, like 'cents' or 'sen'. Default: 'paise'.
 * @property {boolean} majorCurrencyAtEnd - if false, the major currency symbol is at the start of the words, e.g. 2
 * becomes 'rupees two'. If true, e.g. 2 becomes 'two rupees'. Default: false.
 * @property {boolean} minorCurrencyAtEnd - if false, the minor currency symbol is at the start of the appropriate
 * part, e.g. 2.22 becomes 'rupees two and paise twenty two'. If true, e.g. 2.22 becomes 'rupees two and twenty two
 * paise'. Note that the 'and' word will always be used between the major and minor currency parts. Default:true.
 * @property {boolean} suppressMajorIfZero - if true, will not convert the major part to words if it is zero. E.g.
 * 0.22 will become 'twenty two paise'. If false, 0.22 will become 'rupees zero and twenty two paise'. Default
 * false.
 * @property {boolean} suppressMinorIfZero - if true, will not convert the minor part to words if it is zero. E.g.
 * 22.0 will become 'rupees twenty two'. If false, 22.0 will become 'rupees twenty two and zero paise'. Default
 * false.
 * @property {string} useCase - the casing of the words. Possible values are 'lower', 'upper', 'proper' and
 * 'sentence'. Default: 'lower'.
 */

/**
 * The Words object defines the words that are used in conversion.
 * @typedef {Object} Words
 * @property {string[]} unitWords - describes the "unit" words, zero to nineteen. Array indices match the
 * word. E.g.: unitWords[0] is 'zero'
 * @property {string[]} tenWords - describes the "tens" words, twenty to ninety. Array indices match the
 * factor of ten. E.g.: tenWords[3] is 'thirty'. The first two indices should be undefined.
 * @property {{hundred: string, thousand: string}} smallAmountWords - words for "small" large amounts. The keys are "hundred"
 * and "thousand".
 * @property {{lakh: string, crore: string, million: string, billion: string, trillion: string}} bigAmountWords - words for "big" large amounts. The keys are "lakh", "crore",
 * "million", "billion" and "trillion".
 * @property {string} andWord - word used for joining hundreds with units, and joining the integer part with decimal
 * part. Default is 'and'.
 * @property {string} pointWord - word used for describing the decimal part in the international format. Default is
 * 'point', as in 'one point five'.
 * @property {string} onlyWord - word used for describing the end of an amount. Default is 'only'.
 * @property {string} negativeWord - word used for describing negative numbers. Default is 'minus'.
 */

/**
 * @class
 * @private
 */
class NumbersToWordsError extends Error {
    /**
     * @param {string} message
     */
    constructor(message) {
        super(message);
        this.name = 'NumbersToWordsError';
    }
}

/**
 * Validates input number and options
 * @private
 * @param {number} number 
 * @param {Opts} opts 
 */
const validateInput = (number, opts) => {
    if (typeof number !== 'number' || !isFinite(number)) {
        throw new NumbersToWordsError(`Invalid number: ${number}`);
    }

    if (opts && typeof opts !== 'object') {
        throw new NumbersToWordsError(`Options must be an object`);
    }

    const allowedCases = ['lower', 'upper', 'proper', 'sentence'];
    if (opts?.useCase && !allowedCases.includes(opts.useCase.toLowerCase())) {
        throw new NumbersToWordsError(`Invalid useCase: ${opts.useCase}`);
    }

    if ('majorCurrencySymbol' in opts && typeof opts.majorCurrencySymbol !== 'string') {
        throw new NumbersToWordsError(`majorCurrencySymbol must be a string`);
    }

    if ('minorCurrencySymbol' in opts && typeof opts.minorCurrencySymbol !== 'string') {
        throw new NumbersToWordsError(`minorCurrencySymbol must be a string`);
    }

    if ('decimalPlaces' in opts) {
        const dp = opts.decimalPlaces;
        if (!Number.isInteger(dp) || dp < 0 || dp > 10) {
            throw new NumbersToWordsError(`decimalPlaces must be an integer between 0 and 10`);
        }
    }
    // decimalplaces === 0 means integerOnly = true
    if (opts.decimalPlaces === 0) {
        opts.integerOnly = true;
    }
};

/**
 * @private
 * @param {Opts} existingOpts 
 * @param {Opts} newOpts 
 * @returns {Opts}
 */
const combineOpts = (existingOpts, newOpts) => {
    return { ...existingOpts, ...newOpts };
}

/**
 * @private
 * @param {Words} existingWords 
 * @param {Words|{}} [newWords] 
 * @returns {Words}
 */
const combineWords = (existingWords, newWords) => {
    return { ...existingWords, ...newWords };
};

/**
 * @private
 * @param {string} word 
 * @param {Words} words 
 * @returns {string}
 */
const getSmallAmountWord = (word, words) => {
    return ` ${words.smallAmountWords[word]} `;
}

/**
 * @private
 * @param {string} word 
 * @param {Words} words 
 * @returns {string}
 */
const getBigAmountWord = (word, words) => {
    return ` ${words.bigAmountWords[word]} `;
}

/**
 * @private
 * @param {string} word 
 * @param {Words} words 
 * @returns {string}
 */
const getWord = (word, words) => {
    return words[`${word}Word`];
}

/**
 * @private
 * @param {string} value 
 * @param {Opts} opts 
 * @param {boolean} needsComma 
 * @returns {string}
 */
const useComma = (value, opts, needsComma) => {
    return opts.useComma && needsComma ? `${value.trim()}, ` : value;
}

/**
 * @private
 * @param {Number} number 
 * @param {Opts} opts 
 * @param {Words} words 
 * @param {boolean} needsAnd 
 * @returns {string}
 */
const toHundreds = (number, opts, words, needsAnd = false) => {
    var value = number;
    var result = '';

    var hundredFactor = Math.trunc(value / 100);
    if (hundredFactor > 0) {
        result += `${toHundreds(hundredFactor, opts, words)}${getSmallAmountWord('hundred', words)}`;
        value = value % 100;
        needsAnd = true;
    }

    if (value > 19) {
        if (opts.useAnd && needsAnd) {
            result += `${words.andWord} `;
            needsAnd = false;
        }
        var tenFactor = Math.trunc(value / 10);
        result += `${words.tenWords[tenFactor]} `;
        value = value % 10;
    }

    if (value > 0) {
        if (opts.useAnd && needsAnd) {
            result += `${words.andWord} `;
            needsAnd = false;
        }
        result += `${words.unitWords[value]} `;
    }

    return result.trim();
}

/**
 * @private
 * @param {Number} number 
 * @param {Opts} opts 
 * @param {Words} words 
 * @param {boolean} needsComma 
 * @returns {string}
 */
const toIndianThousands = (number, opts, words, needsComma = false) => {
    var value = number;
    var result = '';
    var needsAnd = (value > 999);

    if (value > 9999999) {
        var croreFactor = Math.trunc(value / 10000000);

        result += toIndianThousands(croreFactor, opts, words) + getBigAmountWord('crore', words);
        value = value % 10000000;
        needsComma = true;
    }

    if (value > 99999) {
        result = useComma(result, opts, needsComma);
        var lakhFactor = Math.trunc(value / 100000);

        result += toIndianThousands(lakhFactor, opts, words) + getBigAmountWord('lakh', words);
        value = value % 100000;
        needsComma = true;
    }

    if (value > 999) {
        result = useComma(result, opts, needsComma);
        var thousandFactor = Math.trunc(value / 1000);

        result += toIndianThousands(thousandFactor, opts, words) + getSmallAmountWord('thousand', words);
        value = value % 1000;
        needsComma = true;
    }

    if (value !== 0) {
        if (opts.useComma && needsComma && value > 99 && value % 100 !== 0) {
            result = result.trim() + ', ';
        }
        result += toHundreds(value, opts, words, needsAnd);
    }

    return result.trim();
}

/**
 * @private
 * @param {Number} number 
 * @param {Opts} opts 
 * @param {Words} words 
 * @param {boolean} needsComma 
 * @returns {string}
 */
const toInternationalThousands = (number, opts, words, needsComma = false) => {
    var value = number;
    var result = '';
    var needsAnd = (value > 999);

    if (value > 999999999999) {

        var trillionFactor = Math.trunc(value / 1000000000000);

        result += toInternationalThousands(trillionFactor, opts, words) + getBigAmountWord('trillion', words);
        value = value % 1000000000000;
        needsComma = true;
    }

    if (value > 999999999) {
        result = useComma(result, opts, needsComma);
        var billionFactor = Math.trunc(value / 1000000000);

        result += toInternationalThousands(billionFactor, opts, words) + getBigAmountWord('billion', words);
        value = value % 1000000000;
        needsComma = true;
    }

    if (value > 999999) {
        result = useComma(result, opts, needsComma);
        var millionFactor = Math.trunc(value / 1000000);

        result += toInternationalThousands(millionFactor, opts, words) + getBigAmountWord('million', words);
        value = value % 1000000;
        needsComma = true;
    }

    if (value > 999) {
        result = useComma(result, opts, needsComma);
        var thousandFactor = Math.trunc(value / 1000);

        result += toInternationalThousands(thousandFactor, opts, words) + getSmallAmountWord('thousand', words);
        value = value % 1000;
        needsComma = true;
    }

    if (value !== 0) {
        if (opts.useComma && needsComma && value > 99 && value % 100 !== 0) {
            result = result.trim() + ', ';
        }
        result += toHundreds(value, opts, words, needsAnd);
    }

    return result.trim();
}


/**
 * @private
 * @param {Number} number 
 * @param {Opts} opts 
 * @param {Words} words 
 * @returns {string}
 */
const convertToWords = (number, opts, words) => {
    var value = number;
    var result = '';

    if (value < 0) {
        return `${words.negativeWord} ${convertToWords(-value, opts, words)}`;
    }

    if (value === 0) {
        result = words.unitWords[0];
    } else {
        if (opts.useIndianStyle) {
            result = toIndianThousands(value, opts, words, false);
        } else {
            result = toInternationalThousands(value, opts, words, false);
        }
    }

    return result.trim();
};

/**
 * @private
 * @param {Number} number 
 * @param {Opts} opts 
 * @param {Words} words 
 * @returns {string}
 */
const processCurrency = (number, opts, words) => {
    var result = '';
    let negativeResult = '';

    if (number < 0) {
        negativeResult = `${words.negativeWord} `;
        number = -number;
        //return `${words.negativeWord} ${processCurrency(-number, opts, words)}`;
    }

    var integerValue = Math.trunc(number);
    if (!(integerValue === 0 && opts.suppressMajorIfZero)) {
        var integerPart = convertToWords(integerValue, opts, words);

        if (opts.majorCurrencyAtEnd) {
            result = `${negativeResult}${integerPart} ${opts.majorCurrencySymbol}`;
            negativeResult = '';
        } else {
            result = `${opts.majorCurrencySymbol} ${negativeResult}${integerPart}`;
            negativeResult = '';
        }
    }

    if (!opts.integerOnly) {
        var decimalValue = number - integerValue;
        decimalValue = Math.round(decimalValue * 100);

        if (!(decimalValue === 0 && opts.suppressMinorIfZero)) {
            var decimalPart = convertToWords(decimalValue, opts, words);

            if (result !== '') {
                result += ` ${words.andWord} `;
            }

            if (opts.minorCurrencyAtEnd) {
                result += `${negativeResult}${decimalPart} ${opts.minorCurrencySymbol}`;
            } else {
                result += `${opts.minorCurrencySymbol} ${negativeResult}${decimalPart}`;
            }
        }
    }

    return result;
}

/**
 * @private
 * @param {Number} number 
 * @param {Opts} opts 
 * @param {Words} words 
 * @returns {string}
 */
const processNumber = (number, opts, words) => {
    var result = '';

    if (number < 0) {
        return `${words.negativeWord} ${processNumber(-number, opts, words)}`;
    }

    var integerPart = Math.trunc(number);
    if (!(integerPart === 0 && opts.suppressMajorIfZero)) {
        result = convertToWords(integerPart, opts, words);
    }

    if (!opts.integerOnly) {
        var places = Math.max(0, Math.min(10, opts.decimalPlaces ?? 2));
        var decimalPart = number - integerPart;
        //decimalPart = (Math.round(decimalPart * 100) / 100);
        decimalPart = Math.round(decimalPart * Math.pow(10, places)) / Math.pow(10, places);

        if (!(decimalPart === 0 && opts.suppressMinorIfZero)) {
            if (result !== '') {
                result += ' ';
            }

            result += words.pointWord + ' ';

            var decimalString = decimalPart.toFixed(places);

            var decimalWords = decimalString.split('').splice(2).map(function (digitString) {
                return words.unitWords[parseInt(digitString)]; // convertToWords(digitString, opts, words);
            }).join(' ');

            result += decimalWords.trim();
        }
    }
    return result;
}

/**
 * Converts numbers to readable words with support for currency, casing, and localization.
 * This class is not exported directly — instead, a singleton instance is exposed via the module.
 * @class
 * @private
 */
class NumbersToWords {
    /** @type {Opts} */
    #options;
    /** @type {Words} */
    #words;

    constructor() {
        this.#options = this.defaultOptions;
        this.#words = this.defaultWords
    }

    /**
     * Default options for numberstowords. Read-only.
     * @returns {Opts}
     */
    get defaultOptions() {
        return {
            integerOnly: true,
            decimalPlaces: 2,
            useComma: false,
            useAnd: false,
            useOnlyWord: false,
            useIndianStyle: true,
            useCurrency: false,
            majorCurrencySymbol: 'rupees',
            minorCurrencySymbol: 'paise',
            majorCurrencyAtEnd: false,
            minorCurrencyAtEnd: true,
            suppressMajorIfZero: false,
            suppressMinorIfZero: false,
            useCase: 'lower'
        };
    }

    /**
     * The default set of words used for unit conversition, plus words
     * like 'only' and 'and'. Read-only.
     * @returns {Words}
     */
    get defaultWords() {
        return {
            unitWords: [
                'zero',
                'one',
                'two',
                'three',
                'four',
                'five',
                'six',
                'seven',
                'eight',
                'nine',
                'ten',
                'eleven',
                'twelve',
                'thirteen',
                'fourteen',
                'fifteen',
                'sixteen',
                'seventeen',
                'eighteen',
                'nineteen'
            ],
            tenWords: [undefined, undefined, 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'],
            smallAmountWords: { "hundred": 'hundred', "thousand": 'thousand' },
            bigAmountWords: {
                "lakh": 'lakh',
                "crore": 'crore',
                "million": 'million',
                "billion": 'billion',
                "trillion": 'trillion'
            },
            andWord: 'and',
            pointWord: 'point',
            onlyWord: 'only',
            negativeWord: 'minus'
        };
    }

    /**
     * The global options for numberstowords. The option values can be changed, and
     * subsequent calls to toWords, toIndianWords or toInternationWords will use the
     * changed values by default. This is maintained for backword compatibility, but
     * deprecated. Pass an {@link Opts} object in the parameters instead.
     * @deprecated
     * @returns {Opts}
     */
    get options() {
        return this.#options;
    }

    /**
     * The global set of words used for unit converstion, as well as words like and
     * and only. The values can be changed, and subsequent calls to toWords, 
     * toIndianWords or toInternationWords will use the changed values by default.
     * This is maintained for backword compatibility, but deprecated. Pass a {@link Words}
     * object in the parameters instead.
     * @deprecated
     * @returns {Words}
     * 
     */
    get words() {
        return this.#words;
    }

    /** Converts numbers to words
     * @param {number} number - the number to convert
     * @param {Opts} [opts] - options for conversion
     * @param {Words} [words] - words dictionary
     * @returns {string} - the number converted to words
     * @throws {NumbersToWordsError}
     */
    toWords(number, opts, words) {
        opts = combineOpts(this.options, opts);
        words = combineWords(this.words, words);
        var result = '';

        validateInput(number, opts);

        if (opts.useCurrency) {
            result = processCurrency(number, opts, words);
        } else {
            result = processNumber(number, opts, words);
        }

        if (opts.useOnlyWord && result !== '') {
            result += ' ' + getWord('only', words);
        }

        if (opts.useCase.toLowerCase() !== 'lower') {
            if (opts.useCase.toLowerCase() === 'upper') {
                result = result.toUpperCase();
            } else if (opts.useCase.toLowerCase() === 'proper') {
                result = result.split(' ').map(function properCase(element) {
                    return element.charAt(0).toUpperCase() + element.substring(1);
                }).join(' ');
            } else if (opts.useCase.toLocaleLowerCase() === 'sentence') {
                result = result.charAt(0).toUpperCase() + result.substring(1);
            }
        }

        return result;
    }

    /** Converts numbers to words, Indian style
     * @param {number} number - the number to convert
     * @param {Opts} [opts] - options for conversion. The useIndianStyle option will be set to true.
     * @param {Words} [words] - word dictionary
     * @returns {string} - the number converted to words
     * @throws {NumbersToWordsError}
     */
    toIndianWords(number, opts, words) {
        opts = combineOpts(this.options, opts);
        opts.useIndianStyle = true;
        return this.toWords(number, opts, words);
    }

    /** Converts numbers to words, international style
     * @param {number} number - the number to convert
     * @param {Opts} [opts] - options for conversion. The useIndianStyle option will be set to false.
     * @param {Words} [words] - word dictionary
     * @returns {string} - the number converted to words
     * @throws {NumbersToWordsError}
     */
    toInternationalWords(number, opts, words) {
        opts = combineOpts(this.options, opts);
        opts.useIndianStyle = false;
        return this.toWords(number, opts, words);
    }

    /**
     * Resets the global options and words to the library defaults. This is maintained for
     * backward compatibility, but deprecated. Pass parameters instead of setting the 
     * defaults, and this method will never need to used.
     * @deprecated
     */
    resetOptions() {
        this.#options = this.defaultOptions;

        this.#words = this.defaultWords;

        Object.seal(this.#options);
        Object.seal(this.#words);
    };
}

const numbersToWords = new NumbersToWords();

/**
 * This namespace exposes methods for converting numbers to words.
 * For backward compatibility, it also exposes two properties,
 * options and words, which can be set globally.
 * @type {NumbersToWords}
 * @namespace numberstowords
 */
export default numbersToWords;

/**
 * Converts numbers to words, international style.
 * @name toInternationalWords
 * @function
 * @memberof numberstowords
 * @param {number} number - the number to convert
 * @param {Opts} [opts] - options for conversion. The useIndianStyle option will be set to false.
 * @param {Words} [words] - word dictionary
 * @returns {string} - the number converted to words
 * @throws {NumbersToWordsError}
 * @example const x = numberstowords.toInternationalWords(1000100); // x: one million one hundred
 * @example const x = numberstowords.toInternationalWords(1200000); // x: one million two hundred thousand
 * @example const x = numberstowords.toInternationalWords(1200000, { useComma: true, useOnlyWord: true }); // x: one million, two hundred thousand only
 */

/**
 * Converts numbers to words, Indian style.
 * @name toIndianWords
 * @function
 * @memberof numberstowords
 * @param {number} number - the number to convert
 * @param {Opts} [opts] - options for conversion. The useIndianStyle option will be set to true.
 * @param {Words} [words] - word dictionary
 * @returns {string} - the number converted to words
 * @throws {NumbersToWordsError}
 * @example const x = numberstowords.toIndianWords(1200000); // x: twelve lakh
 * @example const x = numberstowords.toIndianWords(21200000, { useOnlyWord: true }); // x: two crore twelve lakh only
 */

/**
 * Resets the global options and words to the library defaults. This is maintained for
 * backward compatibility, but deprecated. Pass parameters instead of setting the 
 * defaults, and this method will never need to used.
 * @name resetOptions
 * @function
 * @memberof numberstowords
 * @returns {string}
 * @deprecated
 * @example numberstowords.resetOptions();
 */


/**
 * Converts numbers to words.
 * @name toWords
 * @function
 * @memberof numberstowords
 * @param {number} number - the number to convert
 * @param {Opts} [opts] - options for conversion
 * @param {Words} [words] - words dictionary
 * @returns {string} - the number converted to words
 * @throws {NumbersToWordsError}
 * @example const x = numberstowords.toWords(1200000); // x: twelve lakh
 * @example const x = numberstowords.toWords(1200000,  { useIndianStyle: false }); // x: one million two hundred thousand
 * @example const x = numberstowords.toWords(1000101, { useIndianStyle: false, useAnd: true }, { andWord: 'aur' }); // x: one million one hundred aur one
 */

/**
 * The global set of words used for unit converstion, as well as words like 'and'
 * and 'only'. The values can be changed, and subsequent calls to toWords, 
 * toIndianWords or toInternationalWords will use the changed values by default.
 * This is maintained for backward compatibility, but deprecated. Pass a {@link Words}
 * object in the parameters instead.
 * @name words
 * @member
 * @readonly
 * @memberof numberstowords
 * @deprecated
 * @returns {Words}
 * @example numberstowords.tenWords[3] = 'treinta';
 * @example numberstowords.andWord = 'y';
 */

/**
 * The global options for numberstowords. The option values can be changed, and
 * subsequent calls to toWords, toIndianWords or toInternationalWords will use the
 * changed values by default. This is maintained for backward compatibility, but
 * deprecated. Pass an {@link Opts} object in the parameters instead.
 * @name options
 * @member
 * @readonly
 * @memberof numberstowords
 * @deprecated
 * @returns {Opts}
 * @example numberstowords.options.integerOnly = false;
 * @example numberstowords.options.decimalPlaces = 4;
 * @example numberstowords.options.useOnlyWord = true;
 */

/**
 * Default options for numberstowords. Read-only.
 * @name defaultOptions
 * @member
 * @memberof numberstowords
 * @returns {Opts}
 */


/**
 * The default set of words used for unit conversition, plus words
 * like 'only' and 'and'. Read-only.
 * @name defaultWords
 * @member
 * @memberof numberstowords
 * @returns {Words}
 */