import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import swc from '@rollup/plugin-swc';
import terser from '@rollup/plugin-terser';
import { dts } from 'rollup-plugin-dts';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        exports: 'named',
        sourcemap: true
      },
      {
        file: 'dist/index.esm.js',
        format: 'esm',
        exports: 'named',
        sourcemap: true
      },
      {
        file: 'dist/index.min.js',
        format: 'umd',
        name: 'SequenceRequest',
        exports: 'named',
        sourcemap: true,
        plugins: [terser()]
      }
    ],
    plugins: [
      resolve({
        extensions: ['.ts', '.js']
      }),
      commonjs(),
      swc({
        swc: {
          jsc: {
            target: 'es5',
            parser: {
              syntax: 'typescript'
            }
          },
          module: {
            type: 'es6'
          }
        }
      })
    ]
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es'
    },
    plugins: [dts()]
  }
];
