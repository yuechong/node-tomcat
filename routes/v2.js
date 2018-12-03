var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var fs = require('fs');

var proxy = require('http-proxy-middleware');


// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });



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

    res.redirect('/v2');
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

    res.redirect('/v2');
});


//server转接到java


/*router.get('/*', function(req, res, next) {


    console.log(req.url);

    var path = __dirname;

    path = path.replace('routes', '');

    res.sendFile(path + "webapp/v2/index.html");
});*/

module.exports = router;