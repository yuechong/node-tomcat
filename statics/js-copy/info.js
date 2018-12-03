(function() {

        angular.module('app', []).controller('infoCtrl', infoCtrl);

        infoCtrl.$inject = [];

        function infoCtrl() {
            var vm = this;



            vm.user = {
                qq: '',
                phone: '',
                index: '',
                logoName: '',
                brand: '',
                logPic: '',
                channel: 0,

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

                    vm.user.qq="22004526";
                    vm.user.phone="18606515991";

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




        }


    })();