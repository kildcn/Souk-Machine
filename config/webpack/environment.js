// config/webpack/environment.js
const { environment } = require('@rails/webpacker');

// Add React and ES6 support
const webpack = require('webpack');
environment.plugins.prepend(
  'Provide',
  new webpack.ProvidePlugin({
    React: 'react',
    ReactDOM: 'react-dom',
    createRoot: ['react-dom/client', 'createRoot']
  })
);

module.exports = environment;
