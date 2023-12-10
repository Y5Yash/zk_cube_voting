const webpack = require('webpack'); 
module.exports = function override(config) { 
		const fallback = config.resolve.fallback || {}; 
		Object.assign(fallback, { 
    	"crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "path": require.resolve("path-browserify"),
        // "process/browser": require.resolve("process/browser"),
        "fs": false,
        "os": require.resolve("os-browserify/browser"),
      }) 
   config.resolve.fallback = fallback; 
   config.plugins = (config.plugins || []).concat([ 
   	new webpack.ProvidePlugin({ 
    	// process: 'process/browser', 
      Buffer: ['buffer', 'Buffer'] 
    }) 
   ]) 
   return config; }