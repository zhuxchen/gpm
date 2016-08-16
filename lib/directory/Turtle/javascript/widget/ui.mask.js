define(['Widget'], function (Widget) {
    var Mask = Widget.extend({
        setup: function () {
            this.render();
            this.setStyle();
        },
        setStyle: function () {
            var h = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);

            this.$el.css({
                position: 'fixed',
                left: '0px',
                top: '0px',
                zIndex: 900,
                width: '100%',
                height: h + 'px',
                background: '#7e7e7e',
                opacity: 0.5
            });
        },
        show: function () {
            this.$el.show();
        },
        hide: function () {
            this.$el.hide();
        }
    });

    return Mask;
});