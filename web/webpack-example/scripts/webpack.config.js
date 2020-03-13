const webpack = require('webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const path = require('path');
const getBabelConfig = require('./getBabelConfig.js');

const projectRoot = path.resolve(__dirname, '../');
function projectPath(relativePath) {
  return path.resolve(projectRoot, relativePath);
}

const useMiniExtract = false;

// https://webpack.js.org/configuration
// https://github.com/umijs/umi/blob/master/packages/af-webpack/src/getConfig.js
// https://github.com/umijs/umi/blob/master/packages/bundler-webpack/src/getConfig/getConfig.ts
module.exports = function(env = { production: false } /* , argv */) {
  if (env.production) {
    // babel-preset-umi 是根据 NODE_ENV 判断的
    process.env.NODE_ENV = 'production';
  }

  const isDev = !env.production;

  // https://github.com/browserslist/browserslist
  let browsers;
  // if (isDev && !process.env.BUILD_DEV) {
  //   // dev 环境只兼容新浏览器 以方便调试 增加编译速度
  //   browsers = ['last 2 Chrome versions'];
  // } else {
  //   browsers = [
  //     '>1%',
  //     'last 4 versions',
  //     'Firefox ESR',
  //     'not ie < 9', // React doesn't support IE8 anyway
  //   ];
  // }

  const cssOptions = {
    importLoaders: 1,
    sourceMap: false,
  };
  const cssModulesConfig = {
    modules: {
      localIdentName: isDev ? '[name]_[local]__[hash:base64:5]' : '[local]___[hash:base64:5]',
    },
  };
  const postcssOptions = {
    ident: 'postcss',
    plugins: () => [
      require('postcss-flexbugs-fixes'),
      require('postcss-preset-env')({
        autoprefixer: {
          flexbox: 'no-2009',
        },
        stage: 3,
      }),
    ],
  };
  const lessOptions = {
    // modifyVars: theme,
    javascriptEnabled: true,
  };

  function getCSSLoader({ cssModules, less } = {}) {
    const loaders = [
      require.resolve('style-loader'),
      {
        loader: require.resolve('css-loader'),
        options: {
          ...cssOptions,
          ...(cssModules && cssModulesConfig),
        },
      },
      {
        loader: 'postcss-loader',
        options: postcssOptions,
      },
    ];
    if (less) {
      loaders.push({
        loader: 'less-loader',
        options: lessOptions,
      });
    }
    return loaders;
  }

  const cssRules = [
    {
      test: /\.css$/,
      exclude: /\.module\.css$/,
      use: getCSSLoader({
        cssModules: false,
      }),
    },
    {
      test: /\.less$/,
      exclude: /\.module\.less$/,
      use: getCSSLoader({
        cssModules: false,
        less: true,
      }),
    },
    {
      test: /\.module\.css$/,
      use: getCSSLoader({
        cssModules: true,
      }),
    },
    {
      test: /\.module\.less$/,
      use: getCSSLoader({
        cssModules: true,
        less: true,
      }),
    },
  ];

  if (!isDev || useMiniExtract) {
    cssRules.forEach(rule => {
      rule.use[0] = MiniCssExtractPlugin.loader;
    });
  }

  const outputPath = projectPath('dist');

  // js 和 css 采用不同的 hash 算法
  const jsHash = !isDev ? '.[chunkhash:8]' : '';
  const cssHash = !isDev ? '.[contenthash:8]' : '';

  const babelUse = [
    {
      loader: require.resolve('babel-loader'),
      options: getBabelConfig({
        isDev,
        browsers,
      }),
    },
  ];

  const plugins = [
    // isDev && new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
    (!isDev || useMiniExtract) &&
      new MiniCssExtractPlugin({
        filename: `[name]${cssHash}.css`,
        chunkFilename: `[id]${cssHash}.css`,
      }),

    // 只定义 process.env.NODE_ENV 的话在 webpack4 以上可以省略
    new webpack.DefinePlugin({
      // 'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production'),
      __DEV__: isDev,
    }),
    // new HTMLWebpackPlugin({
    //   template: projectPath('src/document.ejs'),
    // }),
    // https://github.com/Urthen/case-sensitive-paths-webpack-plugin
    new CaseSensitivePathsPlugin(),
    // https://doc.webpack-china.org/plugins/ignore-plugin 忽略 moment 的本地化内容
    // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // new CopyWebpackPlugin([
    //   {
    //     from: projectPath('public'),
    //     to: outputPath,
    //     toType: 'dir',
    //   },
    // ]),
    // https://github.com/webpack-contrib/webpack-bundle-analyzer
    process.env.ANALYZE &&
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerPort: process.env.ANALYZE_PORT || 8888,
        openAnalyzer: true,
      }),
  ].filter(Boolean);

  const config = {
    mode: isDev ? 'development' : 'production',
    // entry: projectPath('src/index.tsx'),
    entry: {
      // main: projectPath('src/index.tsx'),
      // home: projectPath('src/pages/home/index.tsx'),
      xxx: projectPath('src/xxx/index.ts'),
    },
    output: {
      path: outputPath,
      // 无法通过输出到 /dev/null 来达到不输出 bundle
      // path: '/dev/null',
      // Add /* filename */ comments to generated require()s in the output.
      pathinfo: isDev,
      filename: `[name]${jsHash}.js`,
      publicPath: '/',
      chunkFilename: `[name]${jsHash}.async.js`,
    },
    // 'source-map'
    devtool: isDev && !process.env.BUILD_DEV ? 'cheap-module-source-map' : 'none',
    devServer: isDev
      ? {
          port: 9007,
        }
      : {},
    bail: !isDev,
    resolve: {
      // modules,
      extensions: [
        '.web.js',
        '.wasm',
        '.mjs',
        '.js',
        '.web.jsx',
        '.jsx',
        '.web.ts',
        '.ts',
        '.web.tsx',
        '.tsx',
        '.json',
      ],
      alias: {
        '@': projectPath('src'),
      },
    },
    module: {
      rules: [
        {
          test: /.+/,
          exclude: /\.ejs$/,
          loader: require.resolve('./anyLoader'),
        },
        // {
        //   test: /\.(js|mjs|jsx|ts|tsx)$/,
        //   loader: require.resolve('./emitFileLoader'),
        // },
        // https://github.com/webpack-contrib/url-loader
        // 考虑 减小 limit 或者 直接用 file-loader
        {
          test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
          loader: require.resolve('url-loader'),
          options: {
            limit: 10000,
            name: 'static/[name].[hash:8].[ext]',
          },
        },
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          use: babelUse,
        },
        ...cssRules,
      ],
    },
    plugins,
    performance: {
      hints: false,
    },
  };

  return config;
};
