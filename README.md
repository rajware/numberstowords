# numberstowords

[![npm version](https://img.shields.io/npm/v/@rajware/numberstowords.svg)](https://www.npmjs.com/package/@rajware/numberstowords)
[![License](https://img.shields.io/github/license/rajware/numberstowords.svg)](LICENSE)
[![npm downloads](https://img.shields.io/npm/dm/@rajware/numberstowords.svg)](https://www.npmjs.com/package/@rajware/numberstowords)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@rajware/numberstowords)](https://bundlephobia.com/package/@rajware/numberstowords)

A lightweight JavaScript library to convert numbers to words. Supports both international and Indian numbering conventions with extensive customization options.

## ✨ Features

- 🌍 **Dual conventions**: International (million, billion) and Indian (lakh, crore) numbering systems
- 💰 **Currency formatting**: Convert amounts to words with customizable currency symbols
- 🎨 **Highly customizable**: Control commas, "and" placement, casing, and more
- 📦 **Universal**: Works in browsers (via CDN or local) or node.js (CommonJS/ESM)
- 🪶 **Lightweight**: Minimal dependencies, maximum functionality

## 🚀 Quick Start

### Installation

#### Node.js applications

Install from npm (recommended):

```bash
npm install @rajware/numberstowords
```

Then import it using: 

```javascript
import numberstowords from '@rajware/numberstowords';
``` 

or 

```javascript
const numberstowords = require('@rajware/numberstowords');
```

#### Browser applications

Load it from a CDN like this.

```html
<script src="https://unpkg.com/@rajware/numberstowords@latest/dist/numberstowords.min.js"></script>

```

You can get code completion in Visual Studio Code by adding a reference comment:

```javascript
/// <reference path="https://unpkg.com/@rajware/numberstowords@latest/dist/numberstowords.d.ts" />
```

You can also download the minified Javascript and the type definition files from the [latest GitHub release](https://github.com/rajware/numberstowords/releases/latest).

### Basic Usage

```javascript

// Indian convention
numberstowords.toIndianWords(123405);
// → "one lakh twenty three thousand four hundred five"

// International convention
numberstowords.toInternationalWords(123405);
// → "one hundred twenty three thousand four hundred five"

// With formatting options
numberstowords.toIndianWords(123405, { useComma: true, useAnd: true });
// → "one lakh, twenty three thousand, four hundred and five"
```

## 💡 Common Use Cases

```javascript
// Currency formatting
numberstowords.toIndianWords(1250.75, {
  integerOnly: false,
  useCurrency: true,
  majorCurrencySymbol: 'dollars',
  minorCurrencySymbol: 'cents'
});
// → "dollars one thousand two hundred fifty and seventy five cents"

// Large numbers
numberstowords.toIndianWords(260000000000, { useComma: true });
// → "twenty six thousand crore"

// Decimal precision
numberstowords.toIndianWords(26.6764, { 
  integerOnly: false, 
  decimalPlaces: 4 
});
// → "twenty six point six seven six four"

// Proper case with "only" suffix
numberstowords.toIndianWords(1500, { 
  useOnlyWord: true, 
  useCase: 'proper' 
});
// → "One Thousand Five Hundred Only"
```

## 📖 Documentation

For complete documentation including:
- All configuration options
- Advanced examples
- Custom word dictionaries
- API reference

Visit: **[https://rajware.github.io/numberstowords/](https://rajware.github.io/numberstowords/)**

## 🐛 Issues & Support

Found a bug or have a question? Please [open an issue](https://github.com/rajware/numberstowords/issues) on GitHub.
