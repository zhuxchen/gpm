var express = require('express');

var main = require('./routes/main');
var routes = [main];

function initRoutes(app) {
	routes.forEach(function(route){
		app.use(route);
	});
}

module.exports = initRoutes;