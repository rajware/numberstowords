/**
 * Type definitions for numberstowords
 * Supports global, ESM, and CommonJS usage
 */

/**
 * Custom error class for numberstowords operations
 */
export class NumbersToWordsError extends Error {
  constructor(message: string);
}

/**
 * Options for number to words conversion
 */
export interface NumbersToWordsOpts {
  /**
   * If true, only convert the integer part of the number
   * @default true
   */
  integerOnly?: boolean;

  /**
   * Number of decimal places to convert (0-10)
   * @default 2
   */
  decimalPlaces?: number;

  /**
   * If true, use commas in the output
   * @default false
   */
  useComma?: boolean;

  /**
   * If true, use "and" before the last part
   * @default false
   */
  useAnd?: boolean;

  /**
   * If true, append "only" at the end
   * @default false
   */
  useOnlyWord?: boolean;

  /**
   * If true, use Indian numbering style (lakh, crore)
   * @default true
   */
  useIndianStyle?: boolean;

  /**
   * If true, format as currency
   * @default false
   */
  useCurrency?: boolean;

  /**
   * Symbol for major currency unit
   * @default "rupees"
   */
  majorCurrencySymbol?: string;

  /**
   * Symbol for minor currency unit
   * @default "paise"
   */
  minorCurrencySymbol?: string;

  /**
   * If true, place major currency symbol at the end
   * @default false
   */
  majorCurrencyAtEnd?: boolean;

  /**
   * If true, place minor currency symbol at the end
   * @default true
   */
  minorCurrencyAtEnd?: boolean;

  /**
   * If true, suppress major currency if zero
   * @default false
   */
  suppressMajorIfZero?: boolean;

  /**
   * If true, suppress minor currency if zero
   * @default false
   */
  suppressMinorIfZero?: boolean;

  /**
   * Case style for output
   * @default "lower"
   */
  useCase?: "lower" | "upper" | "proper" | "sentence";
}

/**
 * Word dictionary for customizing output
 */
export interface NumbersToWordsWords {
  /**
   * Words for units (0-19)
   */
  unitWords?: string[];

  /**
   * Words for tens (20, 30, 40, etc.)
   */
  tenWords?: (string | undefined)[];

  /**
   * Words for small amounts
   */
  smallAmountWords?: {
    hundred: string;
    thousand: string;
  };

  /**
   * Words for big amounts
   */
  bigAmountWords?: {
    lakh: string;
    crore: string;
    million: string;
    billion: string;
    trillion: string;
  };

  /**
   * Word for "and"
   * @default "and"
   */
  andWord?: string;

  /**
   * Word for decimal point
   * @default "point"
   */
  pointWord?: string;

  /**
   * Word for "only"
   * @default "only"
   */
  onlyWord?: string;

  /**
   * Word for negative numbers
   * @default "minus"
   */
  negativeWord?: string;
}

/**
 * NumbersToWords converter interface
 */
export interface NumbersToWords {
  /**
   * Default options used by the converter
   */
  readonly defaultOptions: Readonly<NumbersToWordsOpts>;

  /**
   * Default word dictionary used by the converter
   */
  readonly defaultWords: Readonly<NumbersToWordsWords>;

  /**
   * Global options (deprecated - pass options as parameters instead)
   * @deprecated
   */
  readonly options: NumbersToWordsOpts;

  /**
   * Global word dictionary (deprecated - pass words as parameters instead)
   * @deprecated
   */
  readonly words: NumbersToWordsWords;

  /**
   * Converts a number to words
   * @param number - the number to convert
   * @param opts - options for conversion
   * @param words - word dictionary
   * @returns the number converted to words
   * @throws {NumbersToWordsError}
   * @example
   * const x = numberstowords.toWords(123); // "one hundred twenty three"
   * @example
   * const x = numberstowords.toWords(123.45, { integerOnly: false }); // "one hundred twenty three point four five"
   */
  toWords(number: number, opts?: NumbersToWordsOpts, words?: NumbersToWordsWords): string;

  /**
   * Converts a number to words using Indian numbering style (lakh, crore)
   * @param number - the number to convert
   * @param opts - options for conversion. The useIndianStyle option will be set to true.
   * @param words - word dictionary
   * @returns the number converted to words
   * @throws {NumbersToWordsError}
   * @example
   * const x = numberstowords.toIndianWords(100000); // "one lakh"
   * @example
   * const x = numberstowords.toIndianWords(10000000); // "one crore"
   */
  toIndianWords(number: number, opts?: NumbersToWordsOpts, words?: NumbersToWordsWords): string;

  /**
   * Converts a number to words using International numbering style (million, billion)
   * @param number - the number to convert
   * @param opts - options for conversion. The useIndianStyle option will be set to false.
   * @param words - word dictionary
   * @returns the number converted to words
   * @throws {NumbersToWordsError}
   * @example
   * const x = numberstowords.toInternationalWords(1000100); // "one million one hundred"
   * @example
   * const x = numberstowords.toInternationalWords(1200000); // "one million two hundred thousand"
   * @example
   * const x = numberstowords.toInternationalWords(1200000, { useComma: true, useOnlyWord: true }); // "one million, two hundred thousand only"
   */
  toInternationalWords(number: number, opts?: NumbersToWordsOpts, words?: NumbersToWordsWords): string;

  /**
   * Resets options and words to their default values
   * @deprecated
   */
  resetOptions(): void;
}

/**
 * The numberstowords instance
 */
declare const numberstowords: NumbersToWords;

export default numberstowords;

// Global declaration for browser usage via <script> tag
declare global {
  /**
   * Global numberstowords object for converting numbers to words
   */
  const numberstowords: NumbersToWords;
}
