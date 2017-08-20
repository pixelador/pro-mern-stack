module.exports = {
    entry: './src/App.jsx',
    output: {
        path: './static',
        filename: 'app.bunle.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                loader: 'bable-loader',
                query: {
                    presets: ['react','es2015']
                }
            },
        ]
    }
};