import gulp from 'gulp'
import gulpif from 'gulp-if'
import { log, colors } from 'gulp-util'
import named from 'vinyl-named'
import webpack from 'webpack'
import gulpWebpack from 'webpack-stream'
import plumber from 'gulp-plumber'
import livereload from 'gulp-livereload'
import args from './lib/args'

// antd modify theme -- start
import fs from 'fs'
import path from 'path'
import lessToJs from 'less-vars-to-js'

const themePath = path.join(__dirname, '../app/styles/theme.less')
const themeVariables = lessToJs(fs.readFileSync(themePath, 'utf8'));
/// --end

const ENV = args.production ? 'production' : 'development'

gulp.task('scripts', (cb) => {
  return gulp.src('app/scripts/*.js')
    .pipe(plumber({
      // Webpack will log the errors
      errorHandler() { }
    }))
    .pipe(named())
    .pipe(gulpWebpack({
      devtool: args.sourcemaps ? 'inline-source-map' : false,
      watch: args.watch,
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(ENV),
          'process.env.VENDOR': JSON.stringify(args.vendor)
        })
      ].concat(args.production ? [
        new webpack.optimize.UglifyJsPlugin()
      ] : []),
      module: {
        rules: [
          {
            test: /\.less$/,
            use: [{
              loader: "style-loader" // creates style nodes from JS strings
            }, {
              loader: "css-loader" // translates CSS into CommonJS
            }, {
              loader: "less-loader",
              options: {
                modifyVars: themeVariables
              } // compiles Less to CSS
            }]
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
          },
          {
            test: /\.js$/,
            use: {
              loader: 'babel-loader',
              options: {
                "plugins": [
                  ["import", { libraryName: "antd", style: true }], // `style: true` for less
                  "transform-object-rest-spread"
                ],
                presets: ['env', 'react']
              }
            }

          }]
      }
    },
      webpack,
      (err, stats) => {
        if (err) return
        log(`Finished '${colors.cyan('scripts')}'`, stats.toString({
          chunks: false,
          colors: true,
          cached: false,
          children: false
        }))
      }))
    .pipe(gulp.dest(`dist/${args.vendor}/scripts`))
    .pipe(gulpif(args.watch, livereload()))
})
