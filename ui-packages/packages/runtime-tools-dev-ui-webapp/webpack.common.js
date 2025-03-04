const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack');
const BG_IMAGES_DIRNAME = 'bgimages';
const CopyPlugin = require('copy-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const swEditor = require('@kie-tools/serverless-workflow-diagram-editor-assets');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');

module.exports = {
  entry: {
    standalone: path.resolve(__dirname, 'src', 'standalone', 'standalone.ts'),
    envelope: path.resolve(__dirname, 'src', 'standalone', 'EnvelopeApp.ts'),
    'resources/form-displayer': './src/resources/form-displayer.ts',
    'resources/serverless-workflow-text-editor-envelope':
      './src/resources/ServerlessWorkflowTextEditorEnvelopeApp.ts',
    'resources/serverless-workflow-mermaid-viewer-envelope':
      './src/resources/ServerlessWorkflowMermaidViewerEnvelopeApp.ts',
    'resources/serverless-workflow-combined-editor-envelope':
      './src/resources/ServerlessWorkflowCombinedEditorEnvelopeApp.ts',
    'resources/serverless-workflow-diagram-editor-envelope':
      './src/resources/ServerlessWorkflowDiagramEditorEnvelopeApp.ts'
  },
  plugins: [
    new MonacoWebpackPlugin({
      languages: ['typescript', 'html', 'json', 'yaml'],
      globalAPI: true
    }),
    new webpack.EnvironmentPlugin({
      KOGITO_APP_VERSION: 'DEV',
      KOGITO_APP_NAME: 'Runtime tools dev-ui'
    }),
    new CopyPlugin({
      patterns: [
        { from: './resources', to: './resources' },
        { from: './src/static', to: './static' },
        { from: './src/components/styles.css', to: './components/styles.css' },
        { from: '../monitoring-webapp/dist/', to: './monitoring-webapp' },
        {
          from: '../custom-dashboard-view/dist/',
          to: './custom-dashboard-view'
        },
        {
          from: swEditor.swEditorPath(),
          to: './diagram',
          globOptions: { ignore: ['**/WEB-INF/**/*'] }
        }
      ]
    }),
    new FileManagerPlugin({
      events: {
        onEnd: {
          mkdir: ['./dist/resources/webapp/'],
          copy: [
            { source: './dist/*.js', destination: './dist/resources/webapp/' },
            { source: './dist/*.map', destination: './dist/resources/webapp/' },
            { source: './dist/fonts', destination: './dist/resources/webapp/' },
            {
              source: './dist/monitoring-webapp',
              destination: './dist/resources/webapp/monitoring-webapp'
            },
            {
              source: './dist/custom-dashboard-view',
              destination: './dist/resources/webapp/custom-dashboard-view'
            }
          ]
        }
      }
    }),
    // Remove this replacement after upgrading envelope and patternfly with kie-tools
    new ReplaceInFileWebpackPlugin([
      {
        dir: 'dist',
        test: [/\.js/],
        rules: [
          {
            search:
              '[class*=pf-c-],[class*=pf-c-]::before,[class*=pf-c-]::after{padding:0;margin:0;background-color:rgba(0,0,0,0)}',
            replace: ''
          },
          {
            search:
              '[class*=pf-c-],\n[class*=pf-c-]::before,\n[class*=pf-c-]::after {\n  padding: 0;\n  margin: 0;\n  background-color: transparent;\n}',
            replace: ''
          }
        ]
      }
    ])
  ],
  module: {
    rules: [
      {
        test: /\.(tsx|ts)?$/,
        include: [path.resolve(__dirname, 'src')],
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve('./tsconfig.json'),
              allowTsInNodeModules: true
            }
          }
        ]
      },
      {
        test: /\.(svg|ttf|eot|woff|woff2)$/,
        include: [
          path.resolve('../../node_modules/patternfly/dist/fonts'),
          path.resolve(
            '../../node_modules/@patternfly/react-core/dist/styles/assets/fonts'
          ),
          path.resolve(
            '../../node_modules/@patternfly/react-core/dist/styles/assets/pficon'
          ),
          path.resolve(
            '../../node_modules/@patternfly/patternfly/assets/fonts'
          ),
          path.resolve(
            '../../node_modules/@patternfly/patternfly/assets/pficon'
          ),
          path.resolve('./src/static/'),
          path.resolve(
            '../../node_modules/@kogito-apps/consoles-common/dist/static'
          ),
          path.resolve(
            '../../node_modules/@kogito-apps/components-common/dist/static'
          ),
          path.resolve(
            '../../node_modules/@kogito-apps/jobs-management/dist/static'
          ),
          path.resolve(
            '../../node_modules/@kogito-apps/process-details/dist/static'
          ),
          path.resolve(
            '../../node_modules/@kogito-apps/custom-dashboard-view/dist/static'
          ),
          path.resolve(
            '../../node_modules/@kogito-apps/management-console-shared/dist/static'
          ),
          path.resolve(
            '../../node_modules/@kogito-apps/process-list/dist/static'
          ),
          path.resolve('../../node_modules/@kogito-apps/task-form/dist/static'),
          path.resolve(
            '../../node_modules/@kogito-apps/form-details/dist/static'
          ),
          path.resolve(
            '../../node_modules/@kogito-apps/form-displayer/dist/static'
          ),
          path.resolve(
            '../../node_modules/@kogito-apps/process-form/dist/static'
          ),
          path.resolve(
            '../../node_modules/@kogito-apps/process-definition-list/dist/static'
          ),
          path.resolve(
            '../../node_modules/@kogito-apps/custom-dashboard-view/dist/static'
          ),
          path.resolve(
            '../../node_modules/@kogito-apps/process-monitoring/dist/static'
          ),
          path.resolve(
            '../../node_modules/@kogito-apps/workflow-form/dist/static'
          ),
          path.resolve(
            '../../node_modules/monaco-editor/esm/vs/base/browser/ui/codicons/codicon/codicon.ttf'
          )
        ],
        use: {
          loader: 'file-loader',
          options: {
            // Limit at 50k. larger files emited into separate files
            limit: 5000,
            outputPath: 'fonts',
            name: '[name].[ext]'
          }
        }
      },
      {
        test: /\.svg$/,
        include: (input) => input.indexOf('background-filter.svg') > 1,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 5000,
              outputPath: 'svgs',
              name: '[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        include: (input) => input.indexOf(BG_IMAGES_DIRNAME) > -1,
        use: {
          loader: 'svg-url-loader',
          options: {}
        }
      },
      {
        test: /\.(jpg|jpeg|png|gif)$/i,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve('../../node_modules/patternfly'),
          path.resolve(
            '../../node_modules/@patternfly/patternfly/assets/images'
          ),
          path.resolve(
            '../../node_modules/@patternfly/react-styles/css/assets/images'
          ),
          path.resolve(
            '../../node_modules/@patternfly/react-core/dist/styles/assets/images'
          ),
          path.resolve(
            '../../node_modules/@patternfly/react-core/node_modules/@patternfly/react-styles/css/assets/images'
          ),
          path.resolve(
            '../../node_modules/@patternfly/react-table/node_modules/@patternfly/react-styles/css/assets/images'
          ),
          path.resolve(
            '../../node_modules/@kogito-apps/consoles-common/dist/static'
          ),
          path.resolve(
            '../../node_modules/@kogito-apps/components-common/dist/static'
          ),
          path.resolve(
            '../../node_modules/@kogito-apps/jobs-management/dist/static'
          ),
          path.resolve(
            '../../node_modules/@kogito-apps/process-details/dist/static'
          ),
          path.resolve(
            '../../node_modules/@kogito-apps/management-console-shared/dist/static'
          ),
          path.resolve(
            '../../node_modules/@kogito-apps/process-list/dist/static'
          ),
          path.resolve(
            '../../node_modules/@kogito-apps/form-details/dist/static'
          ),
          path.resolve(
            '../../node_modules/@kogito-apps/form-displayer/dist/static'
          ),
          path.resolve('../../node_modules/@kogito-apps/task-form/dist/static'),
          path.resolve(
            '../../node_modules/@kogito-apps/process-form/dist/static'
          ),
          path.resolve(
            '../../node_modules/@kogito-apps/process-monitoring/dist/static'
          ),
          path.resolve(
            '../../node_modules/@kogito-apps/process-definition-list/dist/static'
          ),
          path.resolve(
            '../../node_modules/@kogito-apps/custom-dashboard-view/dist/static'
          ),
          path.resolve(
            '../../node_modules/@kogito-apps/workflow-form/dist/static'
          )
        ],

        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 5000,
              outputPath: 'images',
              name: '[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    modules: [
      path.resolve('../../node_modules'),
      path.resolve('./node_modules'),
      path.resolve('./src')
    ],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, './tsconfig.json')
      })
    ],
    symlinks: false,
    cacheWithContext: false
  }
};
