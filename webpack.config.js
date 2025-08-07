const CopyPlugin = require('copy-webpack-plugin');

const path = require('path');
const outputPath =
  process.env.FOR_BROWSER === 'firefox' ? 'dist-firefox' : 'dist';
const entryPoints = {
  background: path.resolve(__dirname, 'src', 'background.ts'),
};

module.exports = {
  entry: entryPoints,
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, outputPath),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(jpg|jpeg|png|gif|woff|woff2|eot|ttf|svg)$/i,
        use: 'url-loader?limit=1024',
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: '.', to: '.', context: 'public' },
        {
          from: '.',
          to: '.',
          context:
            process.env.FOR_BROWSER === 'firefox'
              ? 'public-firefox'
              : 'public-generic',
        },
      ],
    }),
  ],
};
