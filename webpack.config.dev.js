const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');

// LOADERS
const rules = {
  js: {
    test: /\.js$/,
    use: [ 'babel-loader' ],
    include: path.join(__dirname, 'client')
  },
  css: {
    test: /\.(styl|css)$/,
    include: path.join(__dirname, 'client'),
    use: ['style-loader', 'css-loader', 'postcss-loader', 'stylus-loader']
  }
};

// CONFIG
const config = module.exports = {};

config.resolve = {
  extensions: ['.js','.css','.styl'],
  mainFields: ['browser','module', 'main']
};

config.module = {
  rules: [
    rules.js,
    rules.css
  ]
};

config.devtool = 'source-map';

config.entry = [
  'webpack-hot-middleware/client', 
  './client/index'];

config.output = {
  path: path.join(__dirname, 'dist'),
  publicPath: '/static/',
  filename: 'bundle.js'
};

config.plugins = [
  new webpack.LoaderOptionsPlugin({
    debug: true,
    minimize: false,
    options: {
      postcss: [
        autoprefixer()  
      ] 
    }
  }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin()
];
