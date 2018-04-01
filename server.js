const express = require('express');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const app = express();
const clientConfig = require('./webpack.conf');

app.use(clientConfig.output.publicPath, express.static(path.resolve(__dirname, 'dist')));

// dev middleware
const clientCompiler = webpack(clientConfig);
const devMiddleware = webpackDevMiddleware(clientCompiler, {
  publicPath: clientConfig.output.publicPath,
  stats: { colors: true },
});

app.use(devMiddleware);

// wait for first compile to complete before starting the server
let started = false;
clientCompiler.plugin('done', (stats) => {
  const { errors } = stats.toJson();

  if (!errors.length && !started) {
    app.listen(3000);
    started = true;
  }
});

// hot middleware
app.use(webpackHotMiddleware(clientCompiler));
