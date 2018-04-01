console.log(process.env.APP_PATH === './app'); // outputs "true"

require(process.env.APP_PATH).render();

if (module.hot) {
  // Uncaught SyntaxError: missing ) after argument list
  module.hot.accept(process.env.APP_PATH, () => {
    require(process.env.APP_PATH).render();
  });

  // works
  /*
  module.hot.accept('./app', () => {
    require(process.env.APP_PATH).render();
  });
  */
}
