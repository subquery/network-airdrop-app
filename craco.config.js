/* eslint-disable no-empty */
const { resolve } = require('path');
const path = require('path');
const {
  compilerOptions: { paths },
} = require('./tsconfig.json');

module.exports = {
  devServer: {
    port: 3030
  },
  webpack: {
    alias: {
      src: resolve(__dirname, 'src'),
      components: resolve(__dirname, 'src/components'),
      appConstants: resolve(__dirname, 'src/appConstants'),
      containers: resolve(__dirname, 'src/containers'), 
      contextProvider: resolve(__dirname, 'src/contextProvider'),
      hooks: resolve(__dirname, 'src/hooks'),
      i18n: resolve(__dirname, 'src/i18n'),
      pages: resolve(__dirname, 'src/pages'),
      utils: resolve(__dirname, 'src/utils'),
    }
  },
};
