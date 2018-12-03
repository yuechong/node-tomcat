(function() {

    angular.module('app', ['atomic-notify']).controller('loginCtr', loginCtr);

    loginCtr.$inject = ['$http', '$q', '$timeout', 'atomicNotifyService'];

    function loginCtr($http, $q, $timeout, atomicNotifyService) {
        var vm = this;

        vm.error = {
            phone: {
                error: false,
                info: ''
            },
            code: {
                error: false,
                info: ''
            },
            pw: {
                error: false,
                info: ''
            }
        }

        vm.user = {
            index:'',
            logoName: '',
            brand: '',
            logPic: '',
            channel: 0,

            phone: '',
            password: '',
            code: '',
            getCode: _getCode,
            submit: _submit
        }


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


        }


        vm.scond = 60;

        function setTime() {
            if (vm.scond !== 0) {
                vm.scond--;
                $timeout(function() {
                    setTime();
                }, 1000);
            } else {
                vm.scond = 60;
            }
        }

        function _getCode() {
            console.log(this);
            this.phone = this.phone.replace(/(^\s*)|(\s*$)/g, "");
            console.log(this.phone);
            if (this.phone.length == 0) {

                vm.error.phone.error = true;
                vm.error.phone.info = "请输入手机号";

            } else if (!(/^1[34578]\d{9}$/.test(this.phone))) {

                vm.error.phone.error = true;
                vm.error.phone.info = "手机号码格式错误";

            } else {

                vm.error.phone.error = false;
                vm.error.phone.info = "";

                //设置倒计时
                setTime();

                $http({
                    method: 'post',
                    url: '/qbmf/sendVerifySMS',
                    data: {
                        type: 1,
                        phone: vm.user.phone,
                        channel: vm.user.channel
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



                    } else {

                        vm.error.phone.error = true;
                        vm.error.phone.info = resp.msg;
                    }
                });

            }
        }

        function _submit() {



            this.phone = this.phone.replace(/(^\s*)|(\s*$)/g, "");
            console.log(this.phone);
            if (this.phone.length == 0) {

                vm.error.phone.error = true;
                vm.error.phone.info = "请输入手机号";

                return;

            }
            if (!(/^1[34578]\d{9}$/.test(this.phone))) {

                vm.error.phone.error = true;
                vm.error.phone.info = "手机号码格式错误";
                return;
            }
            vm.error.phone.error = false;

            this.code = this.code.replace(/(^\s*)|(\s*$)/g, "");
            if (this.code.length == 0) {

                vm.error.code.error = true;
                vm.error.code.info = "请输入验证码";
                return;
            }
            vm.error.code.error = false;


            this.password = this.password.replace(/(^\s*)|(\s*$)/g, "");
            if (this.password.length == 0) {

                vm.error.pw.error = true;
                vm.error.pw.info = "请输入密码";
                return;
            }
            vm.error.pw.error = false;


            if (vm.error.code.error) {
                return;
            }

            _login(vm.user).then(function(resp) {

                vm.error.error = false;

                atomicNotifyService.info('密码重置成功', 1000);

                $timeout(function() {

                    window.location.href = 'login.html';

                }, 900);

            }, function(err) {

                vm.error.code.error = true;
                vm.error.code.info = err.msg;
            });

        }

        function _login(user) {

            var defer = $q.defer();

            $http({
                method: 'post',
                url: '/qbmf/updatePassword',
                data: {
                    nick: user.phone,
                    code: user.code,
                    password: user.password,
                    channel: vm.user.channel
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

                    defer.reject(resp)
                }
            });

            return defer.promise;
        }


    }


})();