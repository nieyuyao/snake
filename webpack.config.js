/* eslint-disable global-require */
const webpack = require('webpack');
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const uglifyJsPlugin = require('uglifyjs-webpack-plugin');
const fs = require('fs');

const isProd = process.env.NODE_ENV === 'production';
const config = {
	entry: {
		app: path.join(__dirname, '/src/index.js')
	},
	output: {
		filename: '[name].[hash].boudle.js',
		path: path.resolve(__dirname) + '/dist'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				include: path.join(__dirname, '/src'),
				enforce: 'pre',
				loader: 'eslint-loader',
				options: {
					failOnError: false,
					failOnWarning: false,
					emitError: false,
					emitWarning: true,
					formatter: require('eslint-friendly-formatter')
				}
			},
			{
				test: /\.js$/,
				include: path.join(__dirname, './src'),
				loader: 'babel-loader'
			}
		]
	},
	plugins: [
		new cleanWebpackPlugin(
			['dist']
		),
		new htmlWebpackPlugin({
			inject: true,
			filename: path.resolve(__dirname) + '/dist/index.html',
			templateContent: fs.readFileSync(path.resolve(__dirname) + '/index.html').toString()
		})
	],
	// webpack4.*新增
	optimization: {
		minimize: false
	}
};
if (isProd) {
	config.plugins = [...config.plugins, new uglifyJsPlugin({
		test: /\.js$/,
		sourceMap: true
	}),
	{
		apply(compiler) {
			compiler.hooks.emit.tap('AssetsPlugin', (compilation) => {
				const assetsPath = path.resolve(__dirname, './assets');
				const filePaths = fs.readdirSync(assetsPath);
				filePaths.forEach(fp => {
					const buffer = fs.readFileSync(assetsPath + '/' + fp);
					compilation.assets['/assets/' + fp] = {
						source() {
							return buffer;
						},
						size() {
							return Buffer.byteLength(buffer);
						}
					}
				});
			});
		}
	}];
} else {
	config.devtool = 'source-map';
}
module.exports = config;