import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import autoPreprocess from 'svelte-preprocess';
import alias from 'rollup-plugin-alias';
import svg from 'rollup-plugin-svg'
import path from 'path'
import {routify} from '@sveltech/routify'

const production = !process.env.ROLLUP_WATCH;

export default {
    input: 'src/main.js',
    output: {
        sourcemap: true,
        format: 'iife',
        name: 'app',
        file: 'public/bundle/bundle.js'
        // dir: 'public/bundle'
    },
    plugins: [
        svg(),
        alias({
            resolve: ['.js', '.svelte', '/index.js'],
            entries: [
                { find: '@', replacement: path.resolve(__dirname + '/src') }
            ]
        }),
        svelte({
            preprocess: autoPreprocess({
                postcss: true
            }),
            // enable run-time checks when not in production
            dev: !production,
            css: css => {
                css.write('public/bundle/components.css');
            }
        }),
        postcss({
            extract: 'public/bundle/utils.css'
        }),

        // If you have external dependencies installed from
        // npm, you'll most likely need these plugins. In
        // some cases you'll need additional configuration —
        // consult the documentation for details:
        // https://github.com/rollup/rollup-plugin-commonjs
        resolve({
            browser: true,
            dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
        }),
        commonjs(),

        // Watch the `public` directory and refresh the
        // browser on changes when not in production
        !production && livereload('public'),

        // If we're building for production (npm run build
        // instead of npm run dev), minify
        production && terser()
    ],
    watch: {
        clearScreen: false
    }
};