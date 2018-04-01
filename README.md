# Webpack DefinePlugin + HotModuleReplacementPlugin Bug Demonstration

Used to supplement issue webpack/webpack#6919

> NOTE: Before assuming this bug is still relevant, please check on the status of the [issue](https://github.com/webpack/webpack/issues/6919).

## Effected versions

The full extend is unknown; the bug is demonstrated using the version of [webpack](https://webpack.js.org/) controlled by this repository.

At the time this README was last updated, the bug is reproducible using the latest `3.x` branch of webpack.

## Problem

When the [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) is used in conjunction with [module.hot.accept()](https://webpack.js.org/api/hot-module-replacement/#accept) from the [HotModuleReplacementPlugin](https://webpack.js.org/plugins/hot-module-replacement-plugin/), the compiled output generates an error.

## Steps to reproduce

First, clone the repo. Then, run the first-time setup routine (alias for `npm i && npm run dev`):
```
npm run setup
```

General usage (alias for `node server`):
```
npm run dev
```

## Expected Behavior

Assuming the following `DefinePlugin` configuration:
```js
new webpack.DefinePlugin({
  'process.env.APP_PATH': JSON.stringify('./app'),
})
```

...and the following `./entry.js`:
```js
console.log(process.env.APP_PATH === './app'); // outputs "true"

require(process.env.APP_PATH).render();

if (module.hot) {
  module.hot.accept(process.env.APP_PATH, () => {
    require(process.env.APP_PATH).render();
  });
}
```

The generated output should look like this:
```js
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

console.log("./app" === './app');

__webpack_require__(0).render();

if (true) {
  module.hot.accept(0, () => {
    __webpack_require__(0).render();
  });
}

/***/ })
```

## Actual Behavior

The generated output looks like this:
```js
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

console.log("./app" === './app');

__webpack_require__(0).render();

if (true) {
  module.hot.accept(0"./app", () => {
    __webpack_require__(0).render();
  });
}

/***/ })
```

...which causes the following runtime error to be thrown:
```
Uncaught SyntaxError: missing ) after argument list
```

By not passing the `DefinePlugin` constant directly to `module.hot.accept()`, the problem goes away. The below example works perfectly:
```js
console.log(process.env.APP_PATH === './app'); // outputs "true"

require(process.env.APP_PATH).render();

if (module.hot) {
  module.hot.accept('./app', () => {
    require(process.env.APP_PATH).render();
  });
}
```