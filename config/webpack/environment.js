// config/webpack/environment.js
const { environment } = require('@rails/webpacker');
const webpack = require('webpack');

// Provide global access to React and ReactDOM
environment.plugins.prepend(
  'Provide',
  new webpack.ProvidePlugin({
    React: 'react',
    ReactDOM: 'react-dom'
  })
);

// Configure babel loader for JSX and modern JavaScript
const babelLoader = environment.loaders.get('babel');

// Only attempt to modify the babel configuration if it exists
if (babelLoader && babelLoader.use && babelLoader.use[0] &&
    babelLoader.use[0].options && babelLoader.use[0].options.presets) {
  // Now it's safe to push to the presets array
  babelLoader.use[0].options.presets.push('@babel/preset-react');
}

// Ensure the resolve.extensions property exists before trying to modify it
if (!environment.config.resolve) {
  environment.config.resolve = {};
}

if (!environment.config.resolve.extensions) {
  environment.config.resolve.extensions = ['.js', '.jsx', '.ts', '.tsx', '.mjs'];
} else {
  // Add the extensions only if they don't already exist
  ['.jsx', '.ts', '.tsx'].forEach(ext => {
    if (!environment.config.resolve.extensions.includes(ext)) {
      environment.config.resolve.extensions.push(ext);
    }
  });
}

// Set development source maps
if (process.env.NODE_ENV === 'development') {
  environment.config.devtool = 'eval-source-map';
}

module.exports = environment;
