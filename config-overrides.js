module.exports = {
  // The Webpack config to use when compiling your react app for development or production.
  webpack: function(config, env) {
    config.optimization.minimize = false; // some library has class name changed, decide to not minify
    return config;
  }
};
