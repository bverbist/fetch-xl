/* global SystemJS */

SystemJS.config({
    baseURL: '/',
    defaultJSExtensions: true,
    transpiler: 'plugin-babel',

    // disable ES2015 feature transpilation for local development (chrome supports it already)
    meta: {
        '*.js': {
            babelOptions: {
                es2015: false
            }
        }
    },

    map: {
        'plugin-babel': 'node_modules/systemjs-plugin-babel/plugin-babel.js',
        'systemjs-babel-build': 'node_modules/systemjs-plugin-babel/systemjs-babel-browser.js'
    }
});