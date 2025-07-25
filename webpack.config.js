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
  ],
  resolve: {
    alias: {
      react: path.resolve(__dirname, './node_modules/react'),
    },
  },
};
