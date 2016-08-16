define(['Widget', 'UIMask'], function (Widget, UIMask) {

    var UILayer = Widget.extend({
        initDefauleConfig: function(){
            this.attrs = {
                template: '<div>UILayer</div>',
                model: null,
                parentNode: document.body,
                needReposition: true,
                maskParam: {
                    needMask: true,
                    maskToHide: true
                }
            };
            this.events = null;
        },
        setup: function () {
            this.render();
            this.setOption();
            this.initLayout();
        },
        initLayout: function () {
            var attrs = this.attrs,
                maskParam = attrs.maskParam;

            if (maskParam.needMask) {
                this.mask = new UIMask();
            }
          
            if (maskParam.needMask && maskParam.maskToHide) {
                this.mask.delegateEvents('click', $.proxy(function () {
                    this.mask.hide();
                }, this));
            }

            if (attrs.needReposition) {
                this._setPosition();
            }
        },
        setOption: function () {},
        _setPosition: function () {
            // 在定位时，为避免元素高度不定，先显示出来
            this.$el.css({
                position: 'fixed',
                visibility: 'hidden',
                display: 'block'
            });
            
            this.$el.css({
                top: '50%',
                left: '50%',
                marginLeft: -(this.$el.width() / 2) + 'px',
                marginTop: -(this.$el.height() / 2) + 'px'
            });

            this.$el.css({
                visibility: '',
                display: 'none'
            });
        },
        _onRenderId: function (val) {
            this.$el.attr('id', val)
        },
        _onRenderClassName: function (val) {
            this.$el.addClass(val)
        },
        _onRenderStyle: function (val) {
            this.$el.css(val)
        },
        show: function () {
            this.mask && this.mask.show();
            this.$el.show();
        },
        hide: function () {
            this.mask && this.mask.hide();
            this.$el.hide();
        }
    });

    return UILayer;
});