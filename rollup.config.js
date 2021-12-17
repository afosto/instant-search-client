import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';

const INPUT = 'src/index.js';

module.exports = [
  {
    input: INPUT,
    plugins: [
      nodeResolve({
        browser: true,
      }),
      babel({
        babelHelpers: 'bundled',
        exclude: /node_modules/,
        presets: [['@babel/preset-env', { modules: false, useBuiltIns: 'usage', corejs: 3 }]],
      }),
      commonjs(),
      terser(),
    ],
    output: {
      file: `dist/afosto-instant-search.min.js`,
      format: 'umd',
      name: 'window',
      extend: true,
    },
  },
  {
    input: INPUT,
    plugins: [nodeResolve()],
    output: [
      {
        dir: 'dist/esm',
        format: 'esm',
        exports: 'named',
        sourcemap: true,
      },
      {
        dir: 'dist/cjs',
        format: 'cjs',
        exports: 'named',
        sourcemap: true,
      },
    ],
  }
];
