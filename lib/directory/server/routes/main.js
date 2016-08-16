var http = require('http');
var express = require('express');
var router = express.Router();

var model = require('../models/model'); // 加载数据模型

router.get('/', function(req, res) {
	var list = [];
	// var param = {
	// 		'path': '/tree.js',
	// 		'content': {'name': 'zhansan'}
	// 	}
	// // 向后台发送请求
	// model.excute(param).then(function(data){
	// 	var list = data.tree || [];

	// 	res.render('main', {'list': list});
	// }).catch(function(error){
	// 	res.render('error', {
	// 		message: error.message,
 //            error: error
	// 	});
	// });

	res.render('main', {'list': list});
});

module.exports = router;