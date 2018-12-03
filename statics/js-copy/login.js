(function() {

    angular.module('app', ['atomic-notify']).controller('loginCtr', loginCtr);

    loginCtr.$inject = ['$http', '$q', '$timeout', 'atomicNotifyService', '$window'];

    function loginCtr($http, $q, $timeout, atomicNotifyService, $window) {
        var vm = this;

        vm.error = {
            error: false,
            info: '密码错误'
        };

        vm.user = {
            index: '',
            isRemember: false,
            logoName: '',
            brand: '',
            logPic: '',
            channel: 0,
            name: '',
            password: '',
            submit: _submit
        };


        init();




        function init() {
            if (window.location.href.indexOf('shop.630game.com') != -1) {

                document.title = "电商先生";

                vm.user.logoName = "电商先生";

                document.querySelector('link[rel=icon]').href = "http://trendata.oss-cn-hangzhou.aliyuncs.com/marketconditions/icon.png";

                vm.user.brand = "./img/dsxs/icon.png";

                vm.user.logPic = './img/dsxs/text.png';

                vm.user.channel = 2;

            } else if (window.location.href.indexOf('esm.fenxiao8.com') != -1) {

                document.title = "品谱大数据";

                vm.user.logoName = "品谱大数据";

                document.querySelector('link[rel=icon]').href = "http://www.hzbigdate.com/assets/img/pingpu.png";

                vm.user.index = "http://www.hzpinpu.com";

                vm.user.brand = "http://www.hzbigdate.com/assets/img/pingpu.png";

                vm.user.channel = 3;

                vm.user.logPic = 'http://www.hzbigdate.com/assets/img/pingpu-text.jpg';

            } else if (window.location.href.indexOf('hzbigdate.com') != -1) {

                document.title = "品谱大数据";

                vm.user.logoName = "品谱大数据";

                document.querySelector('link[rel=icon]').href = "./img/ppdsj/pingpu.png";

                vm.user.index = "http://www.hzpinpu.com";

                vm.user.brand = "./img/ppdsj/pingpu.png";

                vm.user.channel = 3;

                vm.user.logPic = './img/ppdsj/pingpu-text.jpg';

            } else if (window.location.href.indexOf('qzt.sinoac.org') != -1) {

                document.title = "企智通";

                vm.user.logoName = "企智通";

                document.querySelector('link[rel=icon]').href = "./img/qzt/qzt_ico.png";

                vm.user.index = "http://www.sinoac.org";

                vm.user.brand = "./img/qzt/qzt_brand.jpg";

                vm.user.channel = 4;

                vm.user.logPic = './img/qzt/banner.png';

            } else {
                document.title = "情报魔方";
                vm.user.logoName = "情报魔方";
                document.querySelector('link[rel=icon]').href = 'http://trendata.oss-cn-hangzhou.aliyuncs.com/marketconditions/favicon.ico';

                vm.user.index = "http://www.trenddata.cn";

                vm.user.brand = "./img/logo.png";

                // vm.user.logPic = './img/bb.png';

                vm.user.channel = 0;

            }



            var user = window.localStorage.getItem('user');


            if (user) {
                var parse;
                try {
                    parse = JSON.parse(user);

                    parse.password = parseCode(parse.password);
                } catch (oException) {
                    // console.log(item);
                    console.log(oException.name);

                }

                angular.extend(vm.user, parse);
            }

        }

        // 记住密码
        function remeber() {

            if (vm.user.isRemember) {
                //需要保存的
                var json = {
                    isRemember: vm.user.isRemember,
                    name: vm.user.name,
                    password: encode(vm.user.password)
                };
                window.localStorage.setItem('user', JSON.stringify(json));
            } else {
                window.localStorage.removeItem('user');
            }

        }

        function encode(_password) {

            _password = _password.toString();

            // console.log(_password);

            var encodePass = [];

            for (var i = 0; i < _password.length; i++) {

                encodePass.push(_password.charCodeAt(i));
            }

            i = null;
            return encodePass;
        }

        function parseCode(enPassword) {

            var password = "";

            for (var i = 0; i < enPassword.length; i++) {


                var encodep = enPassword[i].toString();

                password += String.fromCharCode(encodep);
            }

            i = null;

            // console.log(password);
            return password;
        }



        function _submit() {

            if (this.name == '') {
                atomicNotifyService.error("请输入用户名", 2000);
                return;
            }
            if (this.password == "") {
                vm.error.error = true;
                vm.error.info = "请输入密码";
                atomicNotifyService.error("请输入密码", 2000);
                return;
            }

            _login(vm.user).then(function(resp) {


                remeber();
                vm.error.error = false;

                atomicNotifyService.success("登陆成功", 2000);


                $window.location.href = "main.html";

            }, function(err) {
                // console.log(err);
                vm.error.error = true;
                vm.error.info = err.msg || err.message;
                atomicNotifyService.error(err.msg || err.message, 2000);
            });

        }

        function _login(user) {
            console.log(new Date());
            var defer = $q.defer();

            $http({
                method: 'post',
                url: '/qbmf/signIn',
                data: {
                    nick: user.name,
                    password: user.password
                },
                headers: {
                    'Accept': 'application/json, text/javascript, */*',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: function(obj) {
                    var str = [];
                    for (var p in obj) {
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    }
                    return str.join("&");
                }
            }).success(function(resp) {

                if (resp.code === 0) {



                    defer.resolve(resp);

                } else {

                    defer.reject(resp);
                }
            }).error(function(err) {
                defer.reject(err);
            });

            return defer.promise;
        }


    }


})();