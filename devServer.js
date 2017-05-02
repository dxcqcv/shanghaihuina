const Koa = require('koa');
const webpack = require('webpack');
const config = require('./webpack.config.dev');
const koaWebpack = require('koa-webpack'); 
const send = require('koa-send');

// Initialize application
const app = module.exports = new Koa();
const compiler = webpack(config);

// webpack dev and hot middleware
const middleware = koaWebpack({
  compiler: compiler,
  dev: {
    noInfo: true,
    publicPath: config.output.publicPath
  }
});

// Handle Error 404 and 500
app.use(async (ctx, next) => {
  try {
    await next(); 
  } catch(err) {
    ctx.status = 500;
    ctx.body = err.message;
  }
});


app.use(middleware);

app.use(async ctx => {
  await send(ctx, 'index.html');
});

// Start server
const port = 7878;
app.listen(port);
console.log('Running server at http://localhost:%d', port);
