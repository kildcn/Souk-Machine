// config/webpack/production.js
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const environment = require('./environment');

// Add production-specific webpack configuration
const config = environment.toWebpackConfig();

// Optimize chunks and minimize in production
config.optimization = {
  minimize: true,
  splitChunks: {
    chunks: 'all',
    name: false
  }
};

module.exports = config;
