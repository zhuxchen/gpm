define(['UILayer'], function (UILayer) {

    var UIDialog = UILayer.extend({
        initDefauleConfig: function(){
            this.attrs = {
                template: '<div class="ui-dialog-wrap">' +
                                '<div class="ui-dialog-content">'+
                                    '<% if(model.title) { %><h3 class="ui-dialog-title"><%= model.title %></h3><% } %>' +
                                    '<p class="ui-dialog-tips"><%= model.content %></p>'+
                                '</div>'+
                                '<div class="ui-dialog-btns">'+
                                    '<% if(model.dialogType == "confirm") { %> <div class="ui-dialog-flexbd ui-dialog-btns-cancel">取消</div> <% } %>' +
                                    '<div class="ui-dialog-flexbd ui-dialog-btns-ok">确定</div>'+
                                '</div>'+
                          '</div>',
                model: {
                    title:'',
                    content: 'UIDialog',
                    dialogType: 'alert'
                },

                parentNode: document.body,

                needReposition: true,

                maskParam: {
                    needMask: true,
                    maskToHide: false
                }
            };
            this.events = {
                'click .ui-dialog-btns-cancel': 'cancelAction',
                'click .ui-dialog-btns-ok': 'okAction'
            };
        },
        setOption: function () {
            var dialogParam = this.attrs.dialogParam;

            for (var k in dialogParam) {
                this[k] = dialogParam[k];
            }
        },
        cancelAction: function (e){
            this.cancelCallback && this.cancelCallback();
            this.hide();
            this.mask.hide();
        },
        okAction: function (e) {
            this.okCallback && this.okCallback();
            this.hide();
            this.mask.hide();
        },
        setDatamodel: function(datamodel){
            if (!datamodel) datamodel = {};
            _.extend(this.attrs, datamodel);
            this.setOption();
            this.refresh();
        }
    });

    return UIDialog;
});