const Webpack = require('webpack'),
   ExtractTextPlugin = require('extract-text-webpack-plugin'),
   NODE_ENV = process.env.NODE_ENV || 'development',
   isDev = NODE_ENV === 'development',
   CleanWebpackPlugin = require('clean-webpack-plugin'),
   Path = require('path'),
   FileSystem = require('fs'),
   critical = require('critical');

const pathsToClean = [
   'dist'
];

const cleanOptions = {
   exclude:  ['manifest.json', 'icons'],
};

module.exports = {
   mode: isDev ? 'development' : 'production',
   optimization: {
      namedModules: true,
      minimize: true,
      noEmitOnErrors: true,
      concatenateModules: true
   },
   entry: {
      app: ['./src/index.js'],
      datepicker: ['air-datepicker'],
   },
   output: {
      path: __dirname + '/dist',
      publicPath: '/dist/',
      filename: isDev ? '[name].bundle.js' : '[name].bundle.[hash].js',
      library: '[name]',
      libraryTarget: 'var'
   },
   externals: {
      'jquery': 'jQuery'
   },
   resolve: {
      extensions: ['.js', '.less']
   },
   watch: isDev,
   devtool: isDev ? 'sheap-inline-module-source-map' : false,
   plugins: [
      new CleanWebpackPlugin(pathsToClean, cleanOptions),
      new ExtractTextPlugin({
         filename: isDev ? 'styles.css' : 'styles.[hash].css',
         allChunks: true
      }),
      new Webpack.DefinePlugin({
         'process.env': {
            'NODE_ENV': JSON.stringify(NODE_ENV)
         }
      }),
      function() {
         this.plugin('done', statsData => {
            let stats = statsData.toJson(),
               htmlOutput;
            if (!stats.errors.length) {
               let htmlFileName = 'index.html',
                  htmlOutput = FileSystem.readFileSync (
                     Path.join(__dirname, 'src/' + htmlFileName),
                     'utf8'
                  );
               if (!isDev) {
                  const yaMetrics = require('./src/metricsScript.js');
                  htmlOutput = htmlOutput.replace (
                     /<script src=(["'])(.+?)bundle\.js/ig,
                     '<script src=$1$2bundle\.' + stats.hash + '\.js'
                  ).replace (
                     /<link rel="stylesheet" href=(["'])(.+?)\.css/,
                     '<link rel="stylesheet" href="$2.' + stats.hash + '\.css'
                  );
                  // .replace (
                  //    '</body>',
                  //    yaMetrics + '\n</body>'
                  // );
                  critical.generate({
                     base: 'dist/',
                     src: 'index.html',
                     dest: 'index.html',
                     extract: true,
                     inline: true,
                     minify: true,
                     css: [`dist/styles.${!isDev ? `${stats.hash}.` : ''}css`],
                  });
               }
               FileSystem.writeFileSync (
                  Path.join(__dirname, 'dist/', htmlFileName),
                  htmlOutput
               );
            }
         });
      }
   ],
   module: {
      rules: [{
         test: /\.js$/,
         exclude: /node_modules/,
         use: ['babel-loader', 'eslint-loader']
      }, {
         test: /\.css|\.less$/,
         use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'postcss-loader', 'less-loader']
         })
      }]
   }
};
