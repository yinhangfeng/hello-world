module.exports = {
  entry: './lib/index.js',
  output: {
    filename: 'dist/webpack-bundle.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
    ]
  }
};
