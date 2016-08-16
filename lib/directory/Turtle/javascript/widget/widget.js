define(function () {
    // 常量
    var DATA_WIDGET_CID = 'data-widget-cid';

    // 所有初始化过的 Widget 实例
    var cachedInstances = {},
        eventSplitter = /(click|tap|touchstart|touchmove|touchend|touchcancel|mouseup|mousedown|mouseover|mousemove|mouseout|input|blur|focus|keydown|keyup)\s+([\s\S]+)/i;

    var Widget = Class.extend({
        init: function (config) {
            // 初始化流程
            // 初始化模板 --> 初始化 $el --> 初始化 events --> 子类初始化
            this.$body = $('body');
            this.cid = _.uniqueId('widget-');

            this.initDefauleConfig();
            this.parseConfig(config || {});

            this.parseTemplate();
            this.parseElement();
            this.initProps();

            this._bindEvents();
            this.delegateEvents();

            this.setup();

            // 保存实例信息
            this._stamp();
        },
        initDefauleConfig: function(){
            this.attrs = {
                template: '<div></div>',
                model: null,
                parentNode: document.body
            };
            this.events = null;
        },
        parseConfig: function (config) {
            var cacheModel  = this.attrs.model;

            if (config.events) {
                _.extend(this.events || {}, config.events || {});
                delete config.events;
            }

            // 临时解决
            _.extend(this.attrs, config);
            _.extend(cacheModel, config.model);
            _.extend(this.attrs.model, cacheModel);
        },
        parseTemplate: function () {
            var attrs = this.attrs;

            this._template = _.template(attrs.template)({'model': attrs.model});
        },
        parseElement: function () {
            // this.$el = attrs.template 
            if (this._template) {
                this.$el = $(this._template);
            }

            // 如果对应的 DOM 元素不存在，则报错
            if (!this.$el || !this.$el[0]) {
                throw new Error('element is invalid')
            }
        },
        delegateEvents: function (eventKey, handler, element) {
            if (eventKey && handler) {
                if (element) {
                    this.$el.on(eventKey, element, handler);
                } else {
                    this.$el.on(eventKey, handler);
                }
            }
        },
        undelegateEvents: function (eventKey, element) {
            if (eventKey) {
                if (element) {
                    this.$el.off(eventKey, element);
                } else {
                    this.$el.off(eventKey);
                }
            }
        },
        render: function () {
            // 将 widget 渲染到页面上
            var parentNode = this.attrs.parentNode;

            if (parentNode) {
                this.$el.appendTo(parentNode);
            }

            return this;
        },
        refresh: function(){
            this._unBindEvents();
            this.parseTemplate();
            this._bindEvents();
            this.parseElement();
            this.render();
            this.initLayout();
        },
        _bindEvents: function () {
            // 解析events，根据events的设置在dom上设置事件
            // 绑定事件
            var self = this,
                events = this.events;

            if (events) {
                for (var eventElem in events) {
                    var eventElems = eventElem.match(eventSplitter),
                        callback = _.isFunction(events[eventElem]) ? events[eventElem] : this[events[eventElem]];

                    var handler = (function () {
                        return $.proxy(callback, self);
                    })();

                    this.$body.delegate(eventElems[2], eventElems[1], handler);
                }
            }
        },
        _unBindEvents: function () {
            var events = this.events;

            // 卸载事件代理
            if (events) {
                for (var eventElem in events) {
                    var eventElems = eventElem.match(eventSplitter);

                    this.$body.undelegate(eventElems[2], eventElems[1]);
                }
            }
        },
        _stamp: function () {
            var cid = this.cid;

            this.$el.attr(DATA_WIDGET_CID, cid);
            cachedInstances[cid] = this;
        },
        destroy: function () {
            // 销毁（应用场景在浏览器关闭的时候）
            this._unBindEvents();
        },
        initProps: function () {},
        setup: function () {}
    });

    return Widget;
});