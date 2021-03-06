const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'src', 'currency-converter.js'),
  optimization: {
    minimize: true,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'CurrencyConverter.js',
  },
};
