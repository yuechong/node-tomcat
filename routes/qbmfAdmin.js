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



//server转接到java
router.all('/*', proxy({
    // target: 'http://120.76.241.193:8081', //http://120.76.241.193:8081/qbmf/login
    // target: 'http://192.168.199.171:30001',
    // target: 'http://121.41.160.43:30001',
    target: 'http://121.41.165.59:30001',
    //target:'http://120.76.241.193:8080',
    changeOrigin: false,
    pathRewrite: {'^/qbmfAdmin/qbmf' : '/qbmf'},
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

        console.log('\n' + '------------------onProxyRes-----------------' + req.url);
        // console.log('\n');
        // console.log(proxyRes.headers);

        //如果用户是从自己产品登陆的，清楚cookie
        if (req.url === '/qbmf/manageSignIn') {

            var header = proxyRes.headers;

            console.log('signIn  d  header');

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
            console.log('----------------this is  user  token:' + token);
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
