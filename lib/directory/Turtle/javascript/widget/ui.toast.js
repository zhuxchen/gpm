define(['UILayer'], function (UILayer) {

    var UIToast = UILayer.extend({
        initDefauleConfig: function(){
            this.attrs = {
                template: '<div class="ui-toast-wrap"><p class="ui-toast-text"><%= model.content %></p></div>',
                model: {
                    content: 'UIToast'
                },
                parentNode: document.body,

                needReposition: true,

                maskParam: {
                    needMask: false,
                    maskToHide: false
                }
            };
            this.events = null;
        },
        setup: function () {
            this.hideSec = 2000;
            this.TIMERRES = null;
            this.isTiming = true;
            this.render();
            this.setOption();
            this.initLayout();
        },
        setOption: function () {
            var toastParam = this.attrs.toastParam;

            for (var k in toastParam) {
                this[k] = toastParam[k];
            }
        },
        setTimer: function () {
            if (this.TIMERRES) clearTimeout(this.TIMERRES);
            this.TIMERRES = setTimeout($.proxy(function () {
                this.hide();
            }, this), this.hideSec);
        },
        hideAction: function () {
        },
        show: function () {
            this.$el.show();
            if (this.isTiming) {
                this.setTimer();
            }
        },
        hide: function () {
            this.$el.hide();
            this.mask && this.mask.hide();
            if (this.TIMERRES) clearTimeout(this.TIMERRES);
            this.hideAction();
        },
        setDatamodel: function(datamodel){
            if (!datamodel) datamodel = {};
            _.extend(this.attrs, datamodel);
            this.setOption();
            this.refresh();
        }
    });

    return UIToast;
});