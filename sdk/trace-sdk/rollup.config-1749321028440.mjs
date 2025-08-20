import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import commonjs from '@rollup/plugin-commonjs';

var outputDirectory = 'dist';
var config = [
    // ESM and CJS builds
    {
        input: 'src/index.ts',
        output: [
            {
                file: "".concat(outputDirectory, "/index.esm.js"),
                format: 'esm',
                sourcemap: true
            },
            {
                file: "".concat(outputDirectory, "/index.cjs.js"),
                format: 'cjs',
                sourcemap: true
            }
        ],
        plugins: [
            resolve(),
            commonjs(),
            json(),
            typescript({
                tsconfig: './tsconfig.json',
                declaration: false
            }),
            terser()
        ]
    },
    // Browser build
    {
        input: 'src/index.ts',
        output: {
            name: 'FingerprintIO',
            file: "".concat(outputDirectory, "/trace-sdk.min.js"),
            format: 'iife',
            sourcemap: true
        },
        plugins: [
            resolve(),
            json(),
            typescript({
                tsconfig: './tsconfig.json',
                declaration: false
            }),
            terser()
        ]
    },
    // Type definitions
    {
        input: 'src/index.ts',
        output: {
            file: "".concat(outputDirectory, "/index.d.ts"),
            format: 'es'
        },
        plugins: [dts()]
    }
];

export { config as default };
