const babel = require('rollup-plugin-babel');
const babelrc = require('babelrc-rollup').default;
const istanbul = require('rollup-plugin-istanbul');
const json = require('rollup-plugin-json');
const commonjs = require('rollup-plugin-commonjs');
const memory = require('rollup-plugin-memory');
const nodeResolve = require('rollup-plugin-node-resolve');
const simpleMemory = require('./plugins/simple-memory');
const path = require('path');

let pkg = require('./package.json');
let external = Object.keys(pkg.dependencies);

let entry = 'lib/index.js';
entry = path.join(__dirname, entry);

module.exports = {
  entry,
  useStrict: false,
  // treeshake: false,
  plugins: [
    // memory 这个插件有问题 path必须设为和entry一致 且contents 需要引用原entry
    // memory({
    //   path: 'xxxx.js',
    //   contents: `module.exports = function() {console.log('xxx/xxx')}`,
    // }),

    simpleMemory({
      modules: {
        'memory-aaa': `//memory-aaa
        import mbbb from 'memory-bbb';

        export default function() {console.log(mbbb)};
        `,
        'memory-bbb': `
        //memory-bbb
        export default {aaa: 1}`,
        'memory-json.json': `{"aaa": 1}`,
      },
    }),
    nodeResolve({
      // use "module" field for ES6 module if possible
      module: true, // Default: true

      // use "jsnext:main" if possible
      // – see https://github.com/rollup/rollup/wiki/jsnext:main
      jsnext: true,  // Default: false

      // use "main" field or index.js, even if it's not an ES6 module
      // (needs to be converted from CommonJS to ES6
      // – see https://github.com/rollup/rollup-plugin-commonjs
      main: true,  // Default: true

      // some package.json files have a `browser` field which
      // specifies alternative files to load for people bundling
      // for the browser. If that's you, use this option, otherwise
      // pkg.browser will be ignored
      // browser: true,  // Default: false

      // not all files you want to resolve are .js files
      extensions: [ '.js', '.json' ],  // Default: ['.js']

      // whether to prefer built-in modules (e.g. `fs`, `path`) or
      // local ones with the same names
      // preferBuiltins: false,  // Default: true

      // Lock the module search in this path (like a chroot). Module defined
      // outside this path will be mark has external
      // jail: '/my/jail/path', // Default: '/'

      // If true, inspect resolved files to check that they are
      // ES2015 modules
      // modulesOnly: true, // Default: false

      // Any additional options that should be passed through
      // to node-resolve
      // customResolveOptions: {
      //   moduleDirectory: 'js_modules'
      // }
    }),
    json(),
    commonjs({
      // non-CommonJS modules will be ignored, but you can also
      // specifically include/exclude files
      // include: 'node_modules/**',  // Default: undefined
      // exclude: [ 'node_modules/foo/**', 'node_modules/bar/**' ],  // Default: undefined

      // search for files other than .js files (must already
      // be transpiled by a previous plugin!)
      // extensions: [ '.js', '.coffee' ],  // Default: [ '.js' ]

      // if true then uses of `global` won't be dealt with by this plugin
      ignoreGlobal: false,  // Default: false

      // if false then skip sourceMap generation for CommonJS modules
      sourceMap: true,  // Default: true

      // explicitly specify unresolvable named exports
      // (see below for more details)
      namedExports: { './lib/import/a1.js': ['a', 'b' ] },  // Default: undefined

      // sometimes you have to leave require statements
      // unconverted. Pass an array containing the IDs
      // or a `id => boolean` function. Only use this
      // option if you know what you're doing!
      // ignore: [ 'conditional-runtime-dependency' ]
    }),
    babel(babelrc()),
    // istanbul({
    //   exclude: ['test/**/*', 'node_modules/**/*']
    // })
  ],
  external: external,
  targets: [
    {
      dest: 'dist/rollup-bundle.cjs.js',
      format: 'cjs',
      sourceMap: true
    },
    // {
    //   dest: pkg.main,
    //   format: 'umd',
    //   moduleName: 'rollupStarterProject',
    //   sourceMap: true
    // },
    // {
    //   dest: pkg.module,
    //   format: 'es',
    //   sourceMap: true
    // },
    // {
    //   dest: 'dist/rollup-bundle.iife.js',
    //   format: 'iife',
    //   moduleName: 'rollupStarterProject',
    //   sourceMap: true
    // },
    // {
    //   dest: 'dist/rollup-bundle.amd.js',
    //   format: 'amd',
    //   sourceMap: true
    // },
  ]
};
