const path = require('path')

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
    	path: path.resolve(__dirname, "./dist"),
    	filename: "index.js",
    	library: {
    		type: "module"
    	}
    },
    experiments: {
    	outputModule: true
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options: {
                    cacheDirectory: true,
                    cacheCompression: false,
                    envName: "production"
                }
            }
        }]
    },
    resolve: {
        extensions: [".js", ".jsx"]
    },
    externals: ["/query.config.js", "react"]
}
