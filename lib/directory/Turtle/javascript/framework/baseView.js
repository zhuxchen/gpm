define(['HeaderView', 'Storage','UIToast'], function (HeaderView, Storage, UIToast) {
    var BaseView = Class.extend({
        _fromUrlStore: null,
        init: function () {
            //this.headerView = HeaderView.newInstance([true]);
            this.$el = $("body");
            this.__bindEvent();
            //this.updateHeader && this.updateHeader();
            //this.saveFrom();
            this.onShow();
        },
        __bindEvent: function () {
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
                    // var eventType = "";

                    // //替换事件.
                    // if (Turtle.isPC) {
                    //     eventType = eventElems[1] == "tap" ? "click" : eventElems[1];
                    // } else {
                    //     eventType = eventElems[1] == "click" ? "tap" : eventElems[1];
                    // }
                    this.$el.delegate(eventElems[2], eventElems[1], handler);
                }
            }
        },
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
        saveFrom: function (viewName) {
            this._fromUrlStore = new Storage('FROM_URL');

            var viewName = viewName || this.viewName,
                fromUrl = '';

            if (!viewName) {
                return;
            }

            fromUrl = decodeURIComponent(location.href.split('from=')[1]);

            if (fromUrl !== 'undefined') {
                this._fromUrlStore.setAttr(viewName, fromUrl);
            }
            
        },
        back: function () {
            var fromUrl = this._fromUrlStore.getAttr(this.viewName);

            if (fromUrl) {
                this.jump(fromUrl)
            } else {
                this.jump(Turtle.homeUrl);
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
        showToast: function (msg, isMask, hideAction) {
            var callback = function(){};
            var needMask = isMask ? true : false;

            if(typeof hideAction === 'function') {
                callback = hideAction;
            }
            new UIToast({
                model: {
                    content: msg
                },
                toastParam: {
                    hideAction: callback
                },
                maskParam:{
                    needMask: needMask,
                    maskToHide: false
                }
            }).show();
        },
        showLoading: function (title, opt) {
            this._showLoading = new UIToast({
                template: '<div class="mask-layer"><div class="loading-container loading"><div class="loader">Loading...</div></div></div>',
                toastParam: {
                    isTiming: false
                },
                maskParam: {
                    needMask: true,
                    maskToHide: false
                }
            });
            
            this._showLoading.show();
        },
        hideLoading: function () {
            this._showLoading.hide();
        },
        isStore: function(store, callback, url) {
            var val = store.get(),
                url = url || Turtle.homeUrl;

            if (!val) {
                this.jump(url);
            } else {
                callback && callback();
            }
        },
        onShow: function () {

        }
    });

    return BaseView;
});
