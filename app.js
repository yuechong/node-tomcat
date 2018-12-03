var compression = require('compression');
var express = require('express');
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var proxy = require('express-http-proxy');
var proxy = require('http-proxy-middleware');

var helmet = require('helmet');

var index = require('./routes/index');

var qbmfAdmin = require('./routes/qbmfAdmin');
// route
var qbmf = require('./routes/qbmf');

// route
var v2 = require('./routes/v2');
var v3 = require('./routes/v3');
var wx = require('./routes/wx');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'webapp', 'favicon.ico')));
app.use(compression());
app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


// Implement CSP with Helmet
app.use(helmet());

app.use(helmet.frameguard({
  action: 'allow-from',
  domain: 'http://pc.1688.com'
}))
// 项目文件 webapp
app.use(express.static(path.join(__dirname, 'webapp')));

app.use('/statics',express.static(path.join(__dirname, 'statics')));




//java 服务器
// app.use('/proxy', proxy('121.41.160.43:30001',{

//   intercept: function(rsp, data, req, res, callback) {
//     // rsp - original response from the target
//     console.log("set-cookie", rsp.headers['set-cookie']);
//     if(rsp.headers['set-cookie']){
//       var c = rsp.headers['set-cookie'][0];
//       var name = c.split('=')[0];
//       var value = c.split('=')[1].split(';')[0];
//       res.cookie(name,value);
//     }
//     callback(null, data);
//   }
// }));






//market pro //java 服务器
// app.use('/marketconditions/**/*.htm', proxy({
//     target: 'http://121.41.160.43:30001',
//     changeOrigin: true
// }));

// app.use('/proxy', proxy({
//     pathRewrite: {'^/proxy' : ''},
//     target: 'http://121.41.160.43:30001',
//     changeOrigin: true
// }));


// 首页
//app.use('/', index);
app.use('/qbmfAdmin', qbmfAdmin);
//qbmf
app.use('/qbmf', qbmf);

app.use('/v2', v2);
// qbmfv3
app.use('/v3', v3);

app.use('/wx', wx);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	
	// console.log(`[TRACE] Server 404 request: ${req.originalUrl}`);

 //    // console.log('404');
 //    // console.log('');

 //    // console.log(req.originalUrl);

 //    var data = new Date() + "  " + `[TRACE] Server 404 request: ${req.originalUrl}`+ "\r\n";


 //    fs.appendFile("log.txt", data, function(err) {
 //        if (err) {
 //            return console.log(err);
 //        }

 //        // console.log("The file was saved!");

 //    });

 //    res.end('ok');

    if(req.originalUrl.match('v2')){
        res.status(200).sendFile(__dirname+"/webapp/v2/index.html");
    }else if(req.originalUrl.match('v3')){
        res.status(200).sendFile(__dirname+"/webapp/v3/index.html");
    }else{
        res.status(404).render('404');
    }
});


// error handler
app.use(function(err, req, res, next) {
    for (var item in req.body) {
        req.sanitize(item).escape();
    }
    next();

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.header("Access-Control-Allow-Credentials", true);
    // render the error page
    res.status(err.status || 500);
    console.log('--------------err-------------------' + req.url);
    res.render('error');
});

//设置跨域访问
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*'); //允许所有域
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST'); //您可以发送  POST和GET请求此服务。
    //X-Requested-With 并content-type 允许头文件。
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    res.header("Content-Type", "application/json;charset=utf-8"); 
    res.setHeader('X-Frame-Options','SAMEORIGIN');
    next();
});

module.exports = app;
