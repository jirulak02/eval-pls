const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = (env, argv) => {
	const isProduction = argv.mode === "production";
	const commonConfig = {
		entry: {
			index: path.resolve(__dirname, "src/index.js"),
		},
		output: {
			path: path.resolve(__dirname, "dist"),
			filename: "[name].[contenthash].js",
			clean: true,
			assetModuleFilename: "assets/[name][ext][query]",
		},
		module: {
			rules: [
				{
					test: /\.css$/,
					use: [MiniCssExtractPlugin.loader, "css-loader"],
				},
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: {
						loader: "babel-loader",
						options: {
							presets: ["@babel/preset-env"],
						},
					},
				},
				{
					test: /\.(png|svg|jpg|jpeg|gif|webp|avif)$/i,
					type: "asset/resource",
				},
				{
					test: /\.(woff|woff2|eot|ttf|otf)$/i,
					type: "asset/resource",
				},
			],
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: "[name].[contenthash].css",
			}),
			new HtmlWebpackPlugin({
				template: path.resolve(__dirname, "src/index.html"),
				favicon: path.resolve(__dirname, "src/assets/favicon.png"),
			}),
		],
	};

	if (isProduction) {
		return {
			...commonConfig,
			mode: "production",
			optimization: {
				minimizer: [
					new TerserPlugin(),
					new CssMinimizerPlugin(),
					new ImageMinimizerPlugin({
						minimizer: {
							implementation: ImageMinimizerPlugin.sharpMinify,
							options: {
								encodeOptions: {
									jpeg: { quality: 100 },
									webp: { lossless: true },
									avif: { lossless: true },
									png: {},
									gif: {},
								},
							},
						},
					}),
				],
				moduleIds: "deterministic",
				runtimeChunk: "single",
				splitChunks: {
					cacheGroups: {
						vendors: {
							test: /[\\/]node_modules[\\/]/,
							name: "vendors",
							chunks: "all",
						},
						styles: {
							name: "styles",
							type: "css/mini-extract",
							chunks: "all",
							enforce: true,
						},
					},
				},
			},
		};
	}
	return {
		...commonConfig,
		mode: "development",
		devtool: "source-map",
		devServer: {
			static: {
				directory: path.resolve(__dirname, "dist"),
			},
			port: 3000,
			open: true,
			hot: true,
			compress: true,
			historyApiFallback: true,
		},
	};
};
