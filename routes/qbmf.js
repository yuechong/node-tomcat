var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var fs = require('fs');

var proxy = require('http-proxy-middleware');


// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

/* GET home page. */
router.get('/', function(req, res, next) {

    console.log(req.url);

    res.redirect('/login.html');
});
//login page
router.get('/login', function(req, res, next) {

    res.redirect('/login.html');
});


//reg page
router.get('/reg', function(req, res, next) {
    res.redirect('/reg.html');
});


//forget page
router.get('/forget', function(req, res, next) {
    res.redirect('/forget.html');
});

router.get('/main', function(req, res, next) {

    // console.log('-----------------this is header:');

    // console.log(req.query.token);


    var token = req.query.token;

    if (token) {

        // res.headers['x-token'] = token;
        // console.log('----------------has token:' + token);
        res.clearCookie('x-authtoken');
        res.cookie('x-authtoken', token, { path: '/qbmf', httpOnly: true });
    }

    res.redirect('/main.html');
});

router.get('/market/main', function(req, res, next) {
    // console.log('hhhhhh');
    // console.log('-----------------this is header:');

    // console.log(req.query.token);


    var token = req.query.token;

    if (token) {

        // res.headers['x-token'] = token;
        // console.log('----------------has token:' + token);
        res.clearCookie('x-authtoken');
        res.cookie('x-authtoken', token, { path: '/qbmf', httpOnly: true });
    }

    res.redirect('/market/main.html');
});
/*//跨域
router.get('/taobaojsonp',proxy({
    target:'https://item.taobao.com/item.htm',
    changeOrigin: false,
    logLevel: 'debug',
    onProxyReq(proxyReq, req, res){

        var referer = "https://item.taobao.com/item.htm?id=" + req.query.id + "&ns=1&abbucket=10";

        console.log(referer);
        proxyReq.setHeader('host','https://www.taobao.com');
        proxyReq.setHeader('origin','https://www.taobao.com');
        proxyReq.setHeader('referer', referer);
    }
})); */
//上报前端错误异常的处理
router.post('/errorInfo', urlencodedParser, jsonParser, function(req, res, next) {

    var info = req.body.errorInfo;
    /**
     *  message:message,
     *  fileName:fileName,
     *  lineNumber:lineNumber,
     *  columnNumber:columnNumber
     */
    // console.log(info);

    var data = new Date() + "  " + info + "\r\n";


    fs.appendFile("qbmf.txt", data, function(err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");

    });

    res.end('ok');
});


//server转接到java
router.all('/*', proxy({
    // target: 'http://120.76.241.193:8081', //http://120.76.241.193:8081/qbmf/login
    // target: 'http://192.168.1.5:30001',
	// target: 'http://121.41.165.59:30001',
    // target: 'http://121.41.160.43:30001',
    target:'http://120.76.241.193:8080',
    changeOrigin: false,
    logLevel: 'debug',
    // onError(err, req, res) {
    //     res.writeHead(500, {
    //         'Content-Type': 'text/plain'
    //     },function(err){
    //         res.end('Something went wrong. And we are reporting a custom error message.' + err);
    //     });

    // },
    //reponse
    onProxyRes(proxyRes, req, res) {

        // console.log('\n' + '------------------onProxyRes-----------------' + req.url);
        // console.log('\n');
        // console.log(proxyRes.headers);

        //如果用户是从自己产品登陆的，清楚cookie
        if (req.url === '/qbmf/signIn') {

            var header = proxyRes.headers;

            // console.log('signIn  d  header');

            // console.log(header);

            res.clearCookie('x-authtoken');

            if (header && header['x-authtoken']) {

                proxyRes.headers['set-cookie'] = 'x-authtoken=' + header['x-authtoken'] + "; HttpOnly";

            }

        }

    },

    //request
    onProxyReq(proxyReq, req, res) {

        // console.log('------------------onProxyReq-----------------' + req.url);
        // console.log('\n');
        // console.log('-----------------cookie----------------');
        // console.log(req.cookies);

        //从cookie里取token
        var token = req.cookies['x-authtoken'];

        //if token 存在
        if (token) {
            // console.log('----------------this is  user  token:' + token);
            // console.log('\n');

            //注入到转接的headers里
            proxyReq.setHeader('x-authtoken', token);
        }

        //退出
        /*if (req.url === '/qbmf/signOut') {

            if (req.body) delete req.body;
            var body = new Object();

            try {
                body.token = token;


                // URI encode JSON object
                body = Object.keys(body).map(function(key) {
                    return encodeURIComponent(key) + '=' + encodeURIComponent(body[key])
                }).join('&');
            } catch (err) {

            }


            // Update header
            proxyReq.setHeader('content-type', 'application/x-www-form-urlencoded');
            proxyReq.setHeader('content-length', body.length);

            // Write out body changes to the proxyReq stream
            proxyReq.write(body, function(err) { proxyReq.end(); });


        }*/

    }

}));


module.exports = router;
