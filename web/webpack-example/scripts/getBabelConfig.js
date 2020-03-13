'use strict';

/**
 * https://github.com/facebook/create-react-app/blob/master/packages/babel-preset-react-app/create.js
 * https://github.com/umijs/umi/blob/master/packages/bundler-utils/src/getBabelOpts.ts
 */
module.exports = function({ isDev, targets, browsers }) {
  return {
    presets: [
      [
        // Latest stable ECMAScript features
        // 包括的插件 https://github.com/babel/babel/blob/master/packages/babel-preset-env/data/plugins.json
        // 包括的 built-ins https://github.com/babel/babel/blob/master/packages/babel-preset-env/data/built-ins.json
        require('@babel/preset-env').default,
        {
          targets: targets || { browsers },
          // Allow importing core-js in entrypoint and use browserlist to select polyfills
          useBuiltIns: 'entry',
          // Set the corejs version we are using to avoid warnings in console
          // This will need to change once we upgrade to corejs@3
          corejs: 3,
          // Do not transform modules to CJS
          modules: false,
          // Exclude transforms that make all code slower
          exclude: ['transform-typeof-symbol'],
        },
      ],
      [
        require('@babel/preset-react').default,
        {
          // Adds component stack to warning messages
          // Adds __self attribute to JSX which React will use for some warnings
          development: isDev,
          // Will use the native built-in instead of trying to polyfill
          // behavior for any plugins that require one.
          useBuiltIns: true,
        },
      ],
      [require('@babel/preset-typescript').default],
    ],
    plugins: [
      [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
      // class { handleClick = () => { } }
      // Enable loose mode to use assignment instead of defineProperty
      // See discussion in https://github.com/facebook/create-react-app/issues/4263
      [
        require('@babel/plugin-proposal-class-properties').default,
        {
          loose: true,
        },
      ],
      // Adds Numeric Separators
      require('@babel/plugin-proposal-numeric-separator').default,
      // Polyfills the runtime needed for async/await, generators, and friends
      // https://babeljs.io/docs/en/babel-plugin-transform-runtime
      [
        require('@babel/plugin-transform-runtime').default,
        {
          corejs: false,
          helpers: true,
          // By default, babel assumes babel/runtime version 7.0.0-beta.0,
          // explicitly resolving to match the provided helper functions.
          // https://github.com/babel/babel/issues/10261
          version: require('@babel/runtime/package.json').version,
          regenerator: true,
          // https://babeljs.io/docs/en/babel-plugin-transform-runtime#useesmodules
          // We should turn this on once the lowest version of Node LTS
          // supports ES Modules.
          // useESModules,
          // Undocumented option that lets us encapsulate our runtime, ensuring
          // the correct version is used
          // https://github.com/babel/babel/blob/090c364a90fe73d36a30707fc612ce037bdbbb24/packages/babel-plugin-transform-runtime/src/index.js#L35-L42
          // absoluteRuntime: absoluteRuntimePath,
        },
      ],
      !isDev && [
        // Remove PropTypes from production build
        require('babel-plugin-transform-react-remove-prop-types').default,
        {
          removeImport: true,
        },
      ],
      // Optional chaining and nullish coalescing are supported in @babel/preset-env,
      // but not yet supported in webpack due to support missing from acorn.
      // These can be removed once webpack has support.
      // See https://github.com/facebook/create-react-app/issues/8445#issuecomment-588512250
      require('@babel/plugin-proposal-optional-chaining').default,
      require('@babel/plugin-proposal-nullish-coalescing-operator').default,
    ].filter(Boolean),
    babelrc: false,
  };
};
