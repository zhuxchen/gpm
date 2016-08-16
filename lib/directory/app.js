var express = require('express');
var path = require('path');
var morgan = require('morgan'); // log
var ejs = require('ejs'); // EJS模板引擎
var bodyParser = require('body-parser')
var favicon = require('serve-favicon');
var fs = require('fs');

var initRoutes = require('./server/config');
var package = require('./package.json');
var accessLog = fs.createWriteStream('access.log', {flags: 'a'});
var errorLog = fs.createWriteStream('error.log', {flags: 'a'});

var app = express();

// view engine setup 
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(morgan('dev'));
app.use(morgan({stream: accessLog}));

app.set('port', package.port);
app.set('views', path.join(__dirname, '/server/views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html'); //修改文件扩展名ejs为html
app.use(express.static(path.join(__dirname, 'public'))); //设置public文件夹为存放静态文件的目录
app.use(express.static(path.join(__dirname, 'client'))); //设置client文件夹为存放静态文件的目录
app.use(express.static(path.join(__dirname, 'dist'))); //设置dist文件夹为存放静态文件的目录
app.use(express.static(path.join(__dirname, 'template')));
app.use(bodyParser.json()); //加载解析json的中间件
app.use(bodyParser.urlencoded({ extended: false })); //加载解析urlencoded请求体的中间件

initRoutes(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (package.env === 'dev') {
    app.use(function(err, req, res, next) {
        var meta = '[' + new Date() + '] ' + req.url + '\n';

        errorLog.write(meta + err.stack + '\n');
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    var meta = '[' + new Date() + '] ' + req.url + '\n';

    errorLog.write(meta + err.stack + '\n');
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// app.listen(app.get('port'), function() {
//   console.log('Express server listening on port ' + app.get('port'));
// });

module.exports = app;