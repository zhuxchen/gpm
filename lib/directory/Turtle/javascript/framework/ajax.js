/**
 * @name ajax
 * @date 2015/03/16
 * @author farman(zhux.chen@qq.com)  
 */

define([], function () {
    "use strict";

    var ajax = (function ($) {
        /**
        * AJAX GET方式访问接口
        */
        function get(url, data, callback, error) {
            var opt = _getCommonOpt(url, data, callback, error);
            opt.type = 'GET';
            return _sendReq(opt);
        };

        /**
        * AJAX POST方式访问接口
        */
        function post(url, data, callback, error) {
            // data = JSON.stringify(data);
            data = JSON.stringify(data);
            var opt = _getCommonOpt(url, data, callback, error);
            opt.type = 'POST';
            opt.dataType = 'json';
            opt.timeout = 30000;
            opt.contentType = 'application/json';
            return _sendReq(opt);
        };

        /**
        * 以GET方式跨域访问外部接口
        */
        function jsonp(url, data, callback, error) {
            var opt = _getCommonOpt(url, data, callback, error);
            opt.type = 'GET';
            opt.dataType = 'jsonp';
            opt.crossDomain = true;
            return _sendReq(opt);
        };

        /**
        * 以POST方法跨域访问外部接口
        */
        function cros(url, type, data, callback, error) {
            var headers = data.headers;
            var async = data.async;

            var newData = null;
            var opt = null;

            if (type.toLowerCase() !== 'get') {
                delete data.headers;
                delete data.async;
                newData = JSON.stringify(data);
                opt = _getCommonOpt(url, data, callback, error);
                opt.type = type;
                opt.dataType = 'json';
                opt.crossDomain = true;
                opt.contentType = 'application/json';
                opt.headers = headers;
                opt.async = async;
                opt.data = newData;
                return _sendReq(opt);
            } else {
                get(url, data, callback, error);
            }
        };

        /**
        * AJAX 提交表单,不能跨域
        * param {url} url
        * param {Object} form 可以是dom对象，dom id 或者jquery 对象
        * param {function} callback
        * param {function} error 可选
        */
        function form(url, form, callback, error) {
            var jdom = null, data = '';
            if (typeof form == 'string') {
                jdom = $('#' + form);
            } else {
                jdom = $(form);
            }
            if (jdom && jdom.length > 0) {
                data = jdom.serialize();
            }
            var opt = _getCommonOpt(url, data, callback, error);
            return _sendReq(opt);
        };

        function _sendReq(opt) {
            var async = true;

            if (opt.type.toLowerCase() !== 'get'){
               if(opt.async != undefined) {
                  async = opt.async;
               }
            } else {
               if(opt.data.async != undefined) {
                  async = opt.data.async;
                  delete opt.data.async;
               }
            }
            var obj = {
                url: opt.url,
                type: opt.type,
                dataType: opt.dataType,
                data: opt.data,
                contentType: opt.contentType,
                headers: opt.headers,
                timeout: opt.timeout || 50000,
                async: async,
                success: function (res, status, xhr) {
                    opt.callback(res, xhr);
                },
                error: function (err) {
                    opt.error && opt.error(err);
                }
            };
            //是否是跨域则加上这条
            if (opt.url.indexOf(window.location.host) === -1) obj.crossDomain = !!opt.crossDomain;
            return $.ajax(obj);
        };

        /**
        * ie 调用 crors
        */
        function _iecros(opt) {
            if (window.XDomainRequest) {
                var xdr = new XDomainRequest();
                if (xdr) {
                    if (opt.error && typeof opt.error == "function") {
                        xdr.onerror = function () {
                            opt.error();;
                        };
                    }
                    //handle timeout callback function
                    if (opt.timeout && typeof opt.timeout == "function") {
                        xdr.ontimeout = function () {
                            opt.timeout();
                        };
                    }
                    //handle success callback function
                    if (opt.success && typeof opt.success == "function") {
                        xdr.onload = function () {
                            if (opt.dataType) {//handle json formart data
                                if (opt.dataType.toLowerCase() == "json") {
                                    opt.callback(JSON.parse(xdr.responseText));
                                }
                            } else {
                                opt.callback(xdr.responseText);
                            }
                        };
                    }

                    //wrap param to send
                    var data = "";
                    if (opt.type == "POST") {
                        data = opt.data;
                    } else {
                        data = $.param(opt.data);
                    }
                    xdr.open(opt.type, opt.url);
                    xdr.send(data);
                }
            }
        };

        function _getCommonOpt(url, data, callback, error) {
            return {
                url: url,
                data: data,
                callback: callback,
                error: error
            }
        };

        return {
            get: get,
            post: post,
            jsonp: jsonp,
            cros: cros,
            form: form
        }
    })($);

    return ajax;
});