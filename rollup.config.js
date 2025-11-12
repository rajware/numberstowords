// rollup.config.js
import terser  from '@rollup/plugin-terser';

export default {
  input: 'src/numberstowords.js',
  output: [
    {
      file: 'dist/numberstowords.mjs',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/numberstowords.cjs',
      format: 'cjs',
      exports: 'auto',
      sourcemap: true,
    },
    {
      file: 'dist/numberstowords.min.js',
      format: 'iife',
      name: 'numberstowords',
      sourcemap: true,
    },
  ],
  plugins: [terser()],
};
