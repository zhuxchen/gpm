/**
  * 乌龟框架
  */
(function () {

     var isPC = (function () {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone",
                    "SymbianOS", "Windows Phone",
                    "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    })();

    var isIOS = (function(){
      var u = navigator.userAgent,
          app = navigator.appVersion,
          isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

      return isIOS;
    })();

    var TurtleConfig = (function () {
        var result = {};

        result.baseUrl = $('meta[name=appBaseUrl]').attr('content');
        result.homeUrl = $('meta[name=homeUrl]').attr('content');

        return result;
    })();

    var Turtle = {
        isIOS: isIOS,
        baseUrl: TurtleConfig.baseUrl,
        homeUrl: TurtleConfig.homeUrl,
        getQuery: function (query, ourl, urlfix) {
            var url = ourl || location.search;
            var param = "";
            var paramStart = url.indexOf(query + "=");
            if (paramStart < 0) {
                return param;
            } else {
                paramStart += query.length + 1;
                urlfix = urlfix || "&";
                var paramEnd = url.substr(paramStart).indexOf(urlfix);
                if (paramEnd > 0) {
                    param = url.substring(paramStart, paramStart + paramEnd);
                } else {
                    param = url.substr(paramStart);
                }
            }
            return decodeURIComponent(param);
        },
        setQuery: function(key, val){
            var url = ourl || location.search;
            var param = "";
            var paramStart = url.indexOf(key + "=");

            if (paramStart < 0 && url == "") {
                return location.href + '?' + key + '=' + val;
            } else {
                paramStart += query.length + 1;

            }
        },
        back: function () {
            var back = history.go(-1);  // 采用浏览器的回退功能

            if (!back) {
                this.jump(this.homeUrl);
            }
        },
        jump: function (url) {
            var isFullPath = url.indexOf('http') > -1;

            if (isFullPath) {
                location.href = url;
            } else {
                location.href = location.protocol + '//' + location.host + Turtle.baseUrl + url;
            }
        },
        _bindEvent: function () {
            var self = this;
            //实现backbone的events
            if (this.events) {
                for (var eventElem in this.events) {
                    var reEventElem = /(click|tap|touchstart|touchmove|touchend|touchcancel|mouseup|mousedown|mouseover|mousemove|mouseout|mouseenter|mouseleave|input|blur|focus|keydown|keyup)\s+([\s\S]+)/i;
                    var eventElems = eventElem.match(reEventElem);
                    var callback = this[this.events[eventElem]];
                    var handler = (function () {
                        return $.proxy(callback, self);
                    })();

                    $("body").delegate(eventElems[2], eventElems[1], handler);
                }
            }
        }
    }

    var loadJS = function () {
        var arr = $('script'),
            len = arr.length,
            origin = location.protocol + '//' + location.host,
            path = origin + TurtleConfig.baseUrl,
            config = '',
            wechatauth = '',
            src = '';

        for (var i = 0; i < arr.length; i++) {
            if ($(arr[i]).attr('type') == 'text/turtle-config') {
                config = $(arr[i]).data('config');
                wechatauth = $(arr[i]).data('wechatauth');
                src = $(arr[i]).data('src');
            }
        }

        if (config) {
            require([path + config], function(config){
                if (wechatauth) {
                    require([path + wechatauth], function (wechatauth) {
                        wechatauth.init(function () {
                            require([path + src]);
                        });
                    });
                } else {
                    require([path + src]);
                }
            });
        }
    }

    loadJS();

    this.Turtle = Turtle;
})();