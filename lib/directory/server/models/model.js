var http = require('http');
var Promise = require('es6-promise-polyfill').Promise;

var config = require('../../config.js');
var options = {
	'host': config.modelHost,
	'port': config.modelPort,
	'method': config.modelMethod
}

function Model(){
	return new Model.prototype.init();
}

Model.prototype = {
	'constructor': 'Model',
	'options': options,
	'excute': function(param){
		var options = this.options;
		var content = options.content;

		options = this.extend(options, param);

		return new Promise(function(resolve, reject){
			var req = http.request(options, function(res){
				var chunk = '';

				res.on('data', function(data) {
					chunk += data;
		        });
		        res.on('end', function() {
					var json = {};

					try {
						json = JSON.parse(chunk.toString());
					} catch (e) {
						var message = e.message;

						e.message = data.toString() + message;
						reject(e);
					}

					resolve(json);
		        });
			});

			if (content) {
				req.write(JSON.stringify(content));
			}

			req.on('error', function(e) {
		        reject(e);
		    });
        	req.end();
		});
	},
	'setParam': function(param){
		var options = this.options;

		this.options = this.extend(options, param);
	},
	'extend': function(target, options){
		// 简单的浅复制
		for(name in options){
			target[name] = options[name];
		}

		return target;
	}
}

Model.prototype.init = function(){
	return this;
};

Model.prototype.init.prototype = Model.prototype;

module.exports = Model();