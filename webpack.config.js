const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.pdf$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'webpack/'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CaseSensitivePathsPlugin()
  ]
};
