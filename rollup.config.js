// rollup.config.js
import terser  from '@rollup/plugin-terser';

export default {
  input: 'src/numberstowords.js',
  output: [
    {
      file: 'dist/numberstowords.mjs',
      format: 'esm',
      banner: '/*! numberstowords v0.3.0 | (c) Rajware Services Pvt. Ltd. | MIT License */',
      sourcemap: true,
    },
    {
      file: 'dist/numberstowords.cjs',
      format: 'cjs',
      exports: 'auto',
      banner: '/*! numberstowords v0.3.0 | (c) Rajware Services Pvt. Ltd. | MIT License */',
      sourcemap: true,
    },
    {
      file: 'dist/numberstowords.min.js',
      format: 'iife',
      name: 'numberstowords',
      banner: '/*! numberstowords v0.3.0 | (c) Rajware Services Pvt. Ltd. | MIT License */',
      sourcemap: true,
    },
  ],
  plugins: [terser()],
};
