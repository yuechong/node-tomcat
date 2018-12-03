var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var https = require("https");

// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });



router.get('/login', function (req, res, next) {

  var code = req.query.code;

  var url = "https://api.weixin.qq.com/sns/jscode2session?appid=wxac853fca7645121f&secret=7add72ea6eafecfe1c2c84db0b019e35&js_code=" + code + "&grant_type=authorization_code";


  https.get(url, (res2) => {
    console.log(res2);
    console.log('状态码：', res2.statusCode);
    console.log('请求头：', res2.headers);
    var resData = '';
    res2.on('data', (d) => {
      resData += data;
    });

    res2.on("end", function () {
      console.log(JSON.parse(resData));
      res.json(JSON.parse(resData));
    });

  }).on('error', (e) => {
    console.error(e);
  });


});


module.exports = router;